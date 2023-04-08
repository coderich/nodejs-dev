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
  let stdin, stdout, stderr;
  ChildProcess.spawnSync(cmd, args.flat(), { shell: true, encoding: 'utf8', stdio: [stdin, stdout, stderr] });
  if (stderr?.length) throw new Error(stderr);
  return stdout.trim();
  // if (child.error) throw new Error(child.error);
  // if (child.stderr.length) throw new Error(child.stderr);
  // return child.stdout.trim();
};
