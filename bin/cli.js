#!/usr/bin/env node
const argv = require('yargs')
    .usage('$0 file.xml')
    .option('d', {
        alias: 'dest',
        default: './index.html',
        describe: 'Destinazione del file di oputput',
        type: 'string'
    }).argv;
const convert = require('../');

Promise.all(argv._.map(file => convert(file, argv.d)));
