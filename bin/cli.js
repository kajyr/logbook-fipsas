#!/usr/bin/env node
const yargs = require('yargs');
const argv = yargs
    .usage('$0 file.xml')
    .option('d', {
        alias: 'dest',
        default: './',
        describe: 'Destinazione (folder) del file di output',
        type: 'string'
    })
    .option('debug', {
        default: false,
        describe: 'Debug mode',
        type: 'boolean'
    })
    .option('empty', {
        default: false,
        describe: 'Prints an empty sheet (Does not load any xml file)',
        type: 'boolean'
    }).argv;
const convert = require('../');

if (argv.empty) {
    convert(undefined, argv.d, argv.debug);
} else {
    if (argv._.length === 0) {
        yargs.showHelp();
        process.exit();
    }

    Promise.all(argv._.map(file => convert(file, argv.d, argv.debug)));
}
