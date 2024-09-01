/* Copyright (c) 2023 Coderich LLC. All Rights Reserved. */

/* eslint-disable no-console, import/no-dynamic-require, global-require */

const Path = require('path');
const ChildProcess = require('child_process');
const AppRootPath = require('app-root-path');

exports.binPath = Path.join(`${AppRootPath}`, 'node_modules', '.bin');
exports.selfPath = Path.join(`${AppRootPath}`, 'node_modules', '@coderich/dev');
exports.cwdPackage = (() => { try { return require(`${process.cwd()}/package.json`); } catch { return {}; } })();
exports.AppRootPackage = require(`${AppRootPath}/package.json`);
exports.AppRootPath = AppRootPath;

exports.shellCommand = (cmd, ...args) => {
  const { status = 0, stdout = '', stderr = '' } = ChildProcess.spawnSync(cmd, args.flat(), { shell: true, encoding: 'utf8' });
  if (status !== 0) throw new Error(stderr);
  return (stderr || stdout).trim();
};
