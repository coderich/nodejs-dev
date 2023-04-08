/* Copyright (c) 2023 Coderich LLC. All Rights Reserved. */

/* eslint-disable no-console, import/no-dynamic-require, global-require */

const FS = require('fs');
const Path = require('path');
const Glob = require('glob');
const { EJSON } = require('bson');
const { AppRootPackage, binPath, shellCommand } = require('./util');

const cache = {};

exports.copyrightHeader = () => {
  const path = Path.join(binPath, 'copyright-header');
  console.log(shellCommand(`${path} --fix --copyrightHolder "Coderich LLC. All Rights Reserved." --include ".js$"`));
};

// exports.migrate = (config) => {
//   const { cmd, filename, uri, folder, project = AppRootPackage.name } = config;
//   return Promise.reject(Error(project));
// };

exports.npmPublish = () => {
  const branch = process.env.GIT_BRANCH || shellCommand('git', 'rev-parse --abbrev-ref HEAD');
  const segments = branch.split('/')[1].split('.');
  const version = ['major', 'minor'][segments.findIndex((el, i) => el !== AppRootPackage.version.split('.')[i])] || 'patch';
  console.log(shellCommand('git config user.name "Richard Livolsi"'));
  console.log(shellCommand('git config user.email "richard.livolsi@gmail.com"'));
  console.log(shellCommand(`npm version -l ${version} -m "Upgrade to %s [skip ci]" && npm publish && git push && git push --tags`));
};

exports.autoMock = (dir) => {
  dir = Path.resolve(dir);
  const { srcMocks, nodeMocks } = exports.getMockFiles(dir);
  srcMocks.forEach(file => jest.mock(file));
  Object.entries(nodeMocks).forEach(([mod, path]) => jest.mock(mod, () => jest.requireActual(path)));
};

exports.getMockFiles = (dir) => {
  dir = Path.resolve(dir);

  cache[dir] = cache[dir] || {
    nodeMocks: Glob.sync(`${dir}/__mocks__/**/*.js`).reduce((prev, file) => {
      const $file = file.replace('.js', '');
      const index = `${dir}/__mocks__/`.length;
      const key = $file.substring(index);
      return Object.assign(prev, { [key]: $file });
    }, {}),
    srcMocks: Glob.sync(`${dir}/src/**/__mocks__/*.js`).map(file => file.replace(/(__mocks__\/|\.js)/g, '')),
  };

  return cache[dir];
};

exports.parseFixtures = (dir) => {
  return FS.readdirSync(dir).reduce((prev, file) => {
    const [name, ext] = file.split('.');
    const filepath = `${dir}/${file}`;

    try {
      switch (ext) {
        case 'js': return Object.assign(prev, { [name]: require(filepath) }); // eslint-disable-line import/no-dynamic-require,global-require
        case 'json': return Object.assign(prev, { [name]: EJSON.parse(FS.readFileSync(filepath), { encoding: 'utf8', flag: 'r' }) });
        default: return prev;
      }
    } catch (e) {
      console.log(`Error parsing fixture "${file}"`); // eslint-disable-line no-console
      throw e;
    }
  }, {});
};
