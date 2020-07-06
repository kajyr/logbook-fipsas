const fs = require('fs-extra');
const path = require('path');

const { saveJson } = require('./lib/fs');
const enrich = require('./lib/enrichers');
const { importer } = require('dive-log-importer');
const pdfkit = require('./lib/pdfkit');

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

async function convert(file, dest, options) {
    const xml = await fs.readFile(file, 'utf8');
    const logbook = await importer(xml);

    return process(logbook, dest, options);
}

async function convertEmpty(dest, options) {
    if (options.verbose) {
        console.log('Rendering empty template');
    }

    return process(EMPTY_LOGBOOK, dest, options);
}

async function process(logbook, dest, options) {
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
