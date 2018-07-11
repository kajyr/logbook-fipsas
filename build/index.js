"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const tmp = require("tmp");
const printer_1 = require("./lib/printer");
const signatures_1 = require("./lib/signatures");
const importer_1 = require("./lib/importer");
const pdf_exporter_1 = require("./lib/pdf-exporter");
const postdata_1 = require("./lib/postdata");
const logbook_1 = require("./lib/logbook");
/*
    Atoms
*/
async function saveJson(file, data) {
    fs.writeFile(`${file}.json`, JSON.stringify(data, null, 2));
}
/*
    Molecules
*/
async function readFile(file, dest, debug) {
    return importer_1.importer(file)
        .then(async (logbook) => {
        if (debug) {
            await saveJson(path.join(dest, 'logbook'), logbook);
        }
        return logbook;
    })
        .then(postdata_1.default);
}
async function convert(file, dest, options) {
    const tmpDir = tmp.dirSync({ unsafeCleanup: !options.debug, keep: options.debug });
    const collector = tmpDir.name;
    if (options.verbose) {
        console.log('Collector dir: ', collector);
    }
    const logbook = await readFile(file, collector, options.debug);
    if (logbook.dives) {
        const availableSignatures = await signatures_1.default(logbook, options.signaturesFolder, collector);
        logbook.dives = logbook.dives.map((dive) => {
            const diveMasterSignature = availableSignatures[dive.dive_master];
            return !diveMasterSignature
                ? dive
                : Object.assign({}, dive, {
                    diveMasterSignature,
                });
        });
    }
    return process(logbook, dest, collector, options);
}
async function convertEmpty(dest, options) {
    console.log('Rendering empty template');
    const tmpDir = tmp.dirSync({ unsafeCleanup: !options.debug, keep: options.debug });
    const collector = tmpDir.name;
    if (options.verbose) {
        console.log('Collector dir: ', collector);
    }
    return process(logbook_1.EMPTY_LOGBOOK, dest, collector, options);
}
exports.convertEmpty = convertEmpty;
async function process(logbook, dest, collector, { verbose, debug, signaturesFolder, template }) {
    const templateFolder = path.join(__dirname, '..', 'templates', template);
    await printer_1.default(templateFolder, logbook, collector);
    return pdf_exporter_1.default(collector, dest, verbose, debug);
}
exports.default = convert;
