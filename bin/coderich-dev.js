#!/usr/bin/env node

/* Copyright (c) 2023 Coderich LLC. All Rights Reserved. */

/* eslint-disable no-console */

const { Command } = require('commander');
const { copyrightHeader, npmPublish, migrate } = require('../src');

const program = new Command();

program.name('Coderich').description('Coderich NodeJS Dev Commander');

program.command('migrate')
  .argument('<cmd>')
  .argument('[filename]')
  .option('-uri, --uri <uri>', 'mongo uri')
  .option('-p, --project <name>', 'project name')
  .option('-f, --folder <name>', 'migration folder name', 'migrations')
  .action((cmd, filename, opts, command) => {
    console.log(opts);
    return migrate({ cmd, filename, ...opts }).catch((e) => {
      console.error(e.message);
      command.help();
    });
  });
program.command('npmPublish').action(npmPublish); // Pass-thru
program.command('copyrightHeader').action(copyrightHeader); // Pass-thru
program.parseAsync(process.argv);
