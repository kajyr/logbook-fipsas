#!/usr/bin/env node
const yargs = require('yargs');
require('dotenv').config();
const { convert, convertEmpty } = require('./');
const { listImporters } = require('dive-log-importer');
const options = require('./lib/options');

const argv = yargs
    .usage('$0 file.xml')
    .option('d', {
        alias: 'dest',
        default: './export.pdf',
        describe: 'Output file name',
        type: 'string'
    })
    .option('template', {
        alias: 't',
        default: 'fipsas-didattica',
        describe: 'Template name',
        type: 'string',
        demandOption: true,
        choices: ['fipsas-didattica', 'pdfkit']
    })
    .option('logo', {
        alias: 'l',
        default: false,
        describe: 'Prints the club logo',
        type: 'boolean'
    })
    .option('v', {
        alias: 'verbose',
        default: false,
        describe: 'Verbose mode',
        type: 'boolean'
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
    })
    .option('importers', {
        default: false,
        describe: 'Print the list of available importers',
        type: 'boolean'
    }).argv;

const { verbose, debug, empty, dest, template, importers, logo } = argv;

const globals = { verbose, debug, logo, empty, template };

if (verbose) {
    const activeFlags = Object.keys(globals).reduce((acc, key) => {
        const val = globals[key];
        return val ? acc.concat(typeof val === 'string' ? `${key}: ${val}` : key) : acc;
    }, []);

    console.log('Active flags: ', activeFlags);
}

if (importers) {
    const list = listImporters();
    console.log('Importers: ', list);
} else if (empty) {
    convertEmpty(dest, globals);
} else if (argv._.length > 0) {
    Promise.all(argv._.map(file => convert(file, dest, globals)));
} else {
    yargs.showHelp();
}
