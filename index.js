const fs = require('fs-extra');
const path = require('path');

const print = require('./lib/printer');
const signatures = require('./lib/signatures');

const { importer } = require('./lib/importer/divelog');

const TEMPLATE = path.join(__dirname, '/templates/fipsas/src');

/*
    Atoms
*/

const saveJson = (file, data) => fs.writeFile(`${file}.json`, JSON.stringify(data, null, 2));

/*
    Molecules
*/

const readFile = (file, dest, debug) =>
    importer(file)
        .then(Logbook => {
            if (debug) {
                return Promise.all([saveJson(path.join(dest, 'logbook'), Logbook)]).then(() => Logbook);
            }
            return Logbook;
        })
        .catch(err => {
            console.error('Something wrong: ', err.message);
        });

/**
 *
 * @param {string} file
 * @param {string} dest Destination folder
 * @param {bool} debug Outputs processed data in json format
 */
const convert = (file, dest, { verbose, debug, signaturesFolder }) => {
    fs
        .ensureDir(dest)
        .then(() => {
            if (file) {
                return readFile(file, dest, debug);
            }
            return [{}];
        })
        .then(logbook =>
            signatures(logbook.dives, signaturesFolder, dest).then(available_signatures => {
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
        .then(logbook => print(TEMPLATE, logbook, dest));
};

module.exports = convert;
