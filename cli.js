#!/usr/bin/env node
const yargs = require('yargs');
const { convert, convertEmpty } = require('./');

const argv = yargs
    .usage('$0 file.xml')
    .option('d', {
        alias: 'dest',
        default: './export.pdf',
        describe: 'Output file name',
        type: 'string',
    })
    .option('template', {
        alias: 't',
        default: 'fipsas-didattica',
        describe: 'Template name',
        type: 'string',
        demandOption: true,
        choices: ['fipsas-didattica', 'pdfkit'],
    })
    .option('logo', {
        alias: 'l',
        default: false,
        describe: 'Prints the club logo',
        type: 'boolean',
    })
    .option('v', {
        alias: 'verbose',
        default: false,
        describe: 'Verbose mode',
        type: 'boolean',
    })
    .option('debug', {
        default: false,
        describe: 'Debug mode',
        type: 'boolean',
    })
    .option('empty', {
        default: false,
        describe: 'Prints an empty sheet (Does not load any xml file)',
        type: 'boolean',
    }).argv;

const { verbose, debug, empty, dest, template, logo } = argv;

const globals = { verbose, debug, logo, empty, template };

if (verbose) {
    const activeFlags = Object.keys(globals).reduce((acc, key) => {
        const val = globals[key];
        return val ? acc.concat(typeof val === 'string' ? `${key}: ${val}` : key) : acc;
    }, []);

    console.log('Active flags: ', activeFlags);
}

if (empty) {
    convertEmpty(dest, globals, spinner);
} else if (argv._.length > 0) {
    Promise.all(argv._.map((file) => convert(file, dest, globals)));
} else {
    yargs.showHelp();
}
