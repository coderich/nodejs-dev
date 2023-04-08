const FS = require('fs');
const Path = require('path');
// const { Config, AppRoot } = require('./index');

const templateCache = {};
const { folder = 'migrations' } = Config.get('lib:migrations') || {};
const migrationsDirectory = Path.join(`${AppRoot}`, folder);
const templateFile = Path.join(__dirname, 'migration.template.js');

const loadTemplate = (tmpl, cb) => {
  if (templateCache[tmpl]) return cb(null, templateCache);

  return FS.readFile(tmpl, { encoding: 'utf8' }, (err, content) => {
    if (err) return cb(err);
    templateCache[tmpl] = content;
    return cb(null, content);
  });
};

module.exports = (opts, cb) => {
  opts = opts || {};
  const { name = '', extention = '.js' } = opts;

  loadTemplate(templateFile, (err, template) => {
    if (err) return cb(err);

    // Ensure migrations directory exists
    if (!FS.existsSync(migrationsDirectory)) FS.mkdirSync(migrationsDirectory);

    // Create date string
    const formattedDate = Date.now();

    // Fix up file path
    const p = Path.join(migrationsDirectory, `${formattedDate}-${name}${extention}`);

    // Write the template file
    return FS.writeFile(p, template, (err3) => {
      if (err3) return cb(err3);
      return cb(null, p);
    });
  });
};
