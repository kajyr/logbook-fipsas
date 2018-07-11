const fs = require('fs-extra');
const path = require('path');
const tmp = require('tmp');

const print = require('./lib/printer');
const signatures = require('./lib/signatures');

const { importer } = require('./lib/importer');
const enrich = require('./lib/postdata');
const exporter = require('./lib/pdf-exporter');

/*
    Atoms
*/

const saveJson = (file, data) => fs.writeFile(`${file}.json`, JSON.stringify(data, null, 2));

/*
    Molecules
*/

const readFile = (file, dest, debug) => {
    return importer(file)
        .then(logbook => {
            if (debug) {
                return saveJson(path.join(dest, 'logbook'), logbook).then(() => logbook);
            }
            return logbook;
        })
        .then(logbook => enrich(logbook))
        .catch(err => {
            console.error('Something wrong: ', err.message);
        });
};

/**
 *
 * @param {string} file
 * @param {string} dest Destination folder
 * @param {bool} debug Outputs processed data in json format
 */
async function convert(file, dest, { verbose, debug, signaturesFolder, template }) {
    const empty = file === undefined;
    const templateFolder = path.join(__dirname, 'templates', template);

    if (empty) {
        console.log('Rendering empty template');
    }
    const tmpDir = tmp.dirSync({ unsafeCleanup: !debug, keep: debug });
    const collector = tmpDir.name;
    if (verbose) {
        console.log('Collector dir: ', collector);
    }

    const logbook = empty
        ? {
              dives: [
                  {
                      empty
                  }
              ]
          }
        : await readFile(file, collector, debug);

    if (logbook.dives) {
        const available_signatures = await signatures(logbook.dives, signaturesFolder, collector);
        logbook.dives = logbook.dives.map(dive => {
            const dive_master_signature = available_signatures[dive.dive_master];
            return !dive_master_signature
                ? dive
                : Object.assign({}, dive, {
                      dive_master_signature
                  });
        });
    }

    await print(templateFolder, logbook, collector);
    return exporter(collector, dest, verbose, debug);
}

module.exports = convert;
