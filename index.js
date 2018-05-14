const fs = require('fs-extra');
const path = require('path');
const tmp = require('tmp');

const print = require('./lib/printer');
const signatures = require('./lib/signatures');

const { importer } = require('./lib/importer');

const TEMPLATE = path.join(__dirname, '/templates/fipsas/src');

/*
    Atoms
*/

const saveJson = (file, data) => fs.writeFile(`${file}.json`, JSON.stringify(data, null, 2));

/*
    Molecules
*/

const readFile = (file, dest, debug) => {
    if (!file) {
        return Promise.resolve([{}]);
    }
    return importer(file)
        .then(logbook => {
            if (debug) {
                return saveJson(path.join(dest, 'logbook'), logbook).then(() => logbook);
            }
            return logbook;
        })
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
const convert = (file, dest, { verbose, debug, signaturesFolder }) => {
    const tmpDir = tmp.dirSync({ unsafeCleanup: !debug, keep: debug });
    const collector = tmpDir.name;
    if (verbose) {
        console.log('Collector dir: ', collector);
    }
    //fs.ensureDir(dest)

    readFile(file, collector, debug)
        .then(logbook =>
            signatures(logbook.dives, signaturesFolder, collector).then(available_signatures => {
                logbook.dives = logbook.dives.map(dive => {
                    const dive_master_signature = available_signatures[dive.dive_master];
                    return !dive_master_signature
                        ? dive
                        : Object.assign({}, dive, {
                              dive_master_signature
                          });
                });
                return logbook;
            })
        )
        .then(logbook => {
            return print(TEMPLATE, logbook, collector);
        });
};

module.exports = convert;
