#!/usr/bin/env node
'use strict';

const yargs = require('yargs');
yargs.commandDir('./cmds').demandCommand(1).help().argv;