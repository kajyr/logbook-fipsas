const fs = require('fs-extra');
const tmp = require('tmp');
const { saveJson } = require('./lib/fs');
const signatures = require('./lib/signatures');
const { enrich } = require('./lib/enrich-dive');
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
            entry_time: null
        }
    ]
};

async function readFile(file, dest, debug) {
    return fs
        .readFile(file, 'utf8')
        .then(xml => importer(xml))
        .then(async logbook => {
            if (debug) {
                await saveJson(dest, 'logbook', logbook);
            }
            return logbook;
        });
}

function folderFromDest(dest) {
    return dest.substring(0, dest.lastIndexOf('/'));
}

async function convert(file, dest, options) {
    const tmpDir = tmp.dirSync({
        unsafeCleanup: !options.debug,
        keep: options.debug
    });
    const collector = tmpDir.name;

    if (options.verbose) {
        console.log('Collector dir: ', collector);
    }

    const logbook = await readFile(file, collector, options.debug);
    if (logbook.dives) {
        const availableSignatures = await signatures(logbook, options, collector);
        logbook.dives = logbook.dives.map(dive => {
            const diveMasterSignature = availableSignatures[dive.dive_master];
            return !diveMasterSignature ? dive : Object.assign({}, dive, { diveMasterSignature });
        });
    }

    return process(logbook, dest, collector, options);
}

async function convertEmpty(dest, options) {
    if (options.verbose) {
        console.log('Rendering empty template');
    }

    const tmpDir = tmp.dirSync({
        unsafeCleanup: !options.debug,
        keep: options.debug
    });
    const collector = tmpDir.name;

    if (options.verbose) {
        console.log('Collector dir: ', collector);
    }

    if (options.debug) {
        await saveJson(collector, 'logbook', EMPTY_LOGBOOK);
    }

    return process(EMPTY_LOGBOOK, dest, collector, options);
}

async function process(logbook, dest, collector, { verbose, debug, signaturesFolder, template }) {
    const enriched = enrich(logbook);
    pdfkit(enriched, dest);
    if (debug) {
        await saveJson(folderFromDest(dest), 'logbook', enriched);
    }
}

module.exports = {
    convert,
    convertEmpty
};
