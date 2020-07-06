const fs = require('fs-extra');
const path = require('path');

const { saveJson } = require('./lib/fs');
const enrich = require('./lib/enrichers');
const { importer } = require('dive-log-importer');
const pdfkit = require('./lib/pdfkit');
const options = require('./lib/options');

const EMPTY_LOGBOOK = {
    dives: [
        {
            gases: [{ pressureStart: '', pressureEnd: '' }],
            tags: [],
            entry: '',
            date: null,
            location: {},
            types: [],
            samples: [],
            entry_time: null,
        },
    ],
};

async function convert(file, dest, globals) {
    const xml = await fs.readFile(file, 'utf8');
    const logbook = await importer(xml);

    return process(logbook, dest, globals);
}

async function convertEmpty(dest, globals) {
    if (globals.verbose) {
        console.log('Rendering empty template');
    }

    return process(EMPTY_LOGBOOK, dest, globals);
}

async function process(logbook, dest, globals) {
    Object.keys(globals).forEach((key) => {
        options[key] = globals[key];
    });

    const destFolder = path.resolve(path.dirname(dest));
    const cacheDir = path.join(destFolder, '.cache');
    await fs.ensureDir(cacheDir);
    options.cacheDir = cacheDir;

    const enriched = await enrich(logbook, options);

    pdfkit(enriched, dest, options);

    if (options.debug) {
        const jsonDebugFile = path.join(destFolder, `logbook.json`);
        await saveJson(jsonDebugFile, enriched);
    }
}

module.exports = {
    convert,
    convertEmpty,
};
