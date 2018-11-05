#!/usr/bin/env ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const __1 = require("..");
const index_1 = require("../lib/importer/index");
const argv = yargs
    .usage('$0 file.xml')
    .option('d', {
    alias: 'dest',
    default: 'export.pdf',
    describe: 'Output file name',
    type: 'string',
})
    .option('signatures', {
    default: './firme',
    describe: 'Folder containing the signatures',
    type: 'string',
})
    .option('template', {
    default: 'fipsas-didattica',
    describe: 'Template name',
    type: 'string',
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
})
    .option('importers', {
    default: false,
    describe: 'Print the list of available importers',
    type: 'boolean',
}).argv;
const { verbose, debug, signatures, empty, dest, template } = argv;
if (empty) {
    __1.convertEmpty(dest, { verbose, debug, signaturesFolder: signatures, template });
}
else if (argv.importers) {
    index_1.listImporters();
}
else {
    if (argv._.length === 0) {
        yargs.showHelp();
        process.exit();
    }
    Promise.all(argv._.map((file) => __1.default(file, dest, { verbose, debug, signaturesFolder: signatures, template })));
}
