/* Copyright (c) 2023 Coderich LLC. All Rights Reserved. */

const Path = require('path');
const migrate = require('migrate');
const { AppRootPath, AppRootPackage, binPath, shellCommand } = require('./util');

module.exports = class Migrate {
  #cmd;
  // #config;
  // #filepath;

  constructor(config) {
    this.#cmd = Path.join(binPath, 'migrate');
    // this.#config = config;
    // const { cmd, filename, uri, folder, project = AppRootPackage.name } = config;
  }

  create(filename) {
    return shellCommand(this.#cmd, 'create', filename);
  }

  up() {
    return new Promise((resolve, reject) => {
      migrate.load({
        stateStore: '',
        migrationsDirectory: '',
        filterFunction: '',
        sortFunction: '',
      }, (set) => {

      });
    });
  }
};
