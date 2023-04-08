const FS = require('fs');
const Path = require('path');
// const { get, without } = require('lodash');
// const { Data, Config, Logger, AppRoot, EventEmitter } = require('./index');

// const timeout = ms => new Promise(res => setTimeout(res, ms));
// const { project, sleep = 60000, retry = 5, folder = 'migrations' } = Config.get('lib:migrations');
// const retryErrorMsg = `Migration retry limit of ${retry} x ${sleep}ms reached for project ${project}`;

class Store {
  constructor() {
    this.retries = 0;
    this.counter = 0;
    this.emitter = new EventEmitter();
    this.promise = Data.Mongo.awaitModel('Migration');
    this.folder = Path.join(`${AppRoot}`, folder);
    this.files = FS.readdirSync(this.folder).filter(file => Path.extname(file).toLowerCase() === '.js');
    this.counter = 0;
  }

  async load(cb) {
    // Upsert migration with a pre-emptive lock (returning old/original document!)
    const MigrationModel = await this.promise;
    const migration = await MigrationModel.findOneAndUpdate({ project }, { project, locked: true }, { upsert: true, w: 'majority' });

    // If it was already locked; enter wait loop
    if (migration && migration.locked) return this.loop(cb);

    // Determine if there's any migrations to run; unlock if none
    const migrated = get(migration, 'migrations', []).map(m => m.title);
    this.counter = without(this.files, ...migrated).length;
    if (this.counter === 0) await MigrationModel.findOneAndUpdate({ project }, { locked: false }, { w: 'majority' });

    //
    return cb(null, migration || {});
  }

  async save(set, cb) {
    const locked = Boolean(--this.counter > 0);
    const MigrationModel = await this.promise;
    const migration = await MigrationModel.findOneAndUpdate({ project }, { project, migrations: set.migrations, last_run: set.lastRun, locked }, { new: true, upsert: true, w: 'majority' });
    if (!locked) await this.notify();
    cb(null, migration);
  }

  loop(cb) {
    if (++this.retries > retry) {
      Logger.error(retryErrorMsg);
      return cb(retryErrorMsg);
    }

    Logger.info(`${project} migrations locked; sleeping for ${sleep}ms... (loop #${this.retries} of ${retry})`);
    return timeout(sleep).then(() => this.load(cb));
  }

  async notify() {
    if (!this.emitted) {
      this.emitted = true;
      await this.emitter.emit('postMigration');
    }
  }
}

module.exports = Store;
