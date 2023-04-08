/* Copyright (c) 2023 Coderich LLC. All Rights Reserved. */

/* eslint-disable no-console, import/no-dynamic-require, global-require */

const Path = require('path');
const ChildProcess = require('child_process');
const AppRootPath = require('app-root-path');

exports.binPath = Path.join(`${AppRootPath}`, 'node_modules', '.bin');
exports.selfPath = Path.join(`${AppRootPath}`, 'node_modules', '@coderich/nodejs-dev');
exports.AppRootPackage = require(`${AppRootPath}/package.json`);
exports.AppRootPath = AppRootPath;

exports.shellCommand = (cmd, ...args) => {
  const { status = 0, stdout = '', stderr = '' } = ChildProcess.spawnSync(cmd, args.flat(), { shell: true, encoding: 'utf8' });
  if (status !== 0) throw new Error(stderr);
  return stdout.trim();
};
