const fs = require('fs-extra');
const path = require('path');
const { copy } = require('./lib/fs');
const print = require('./lib/printer');

const { importer } = require('./lib/importer/divelog');

const TEMPLATE = path.join(__dirname, '/templates/fipsas/src');

/*
    Atoms
*/

const saveJson = (file, data) => fs.writeFile(`${file}.json`, JSON.stringify(data, null, 2));

const unique = list => Array.from(new Set(list));

const strDasherize = str => str.replace(/\s+/g, '-').toLowerCase();
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

const fetchSignatures = (data, signatures, dest) => {
    return Promise.all(
        unique(data.map(dive => dive.dive_master))
            .map(strDasherize)
            .map(str => path.join(signatures, `${str}.png`))
            .map(file =>
                copy(file, dest).catch(err => {
                    if (err.code === 'ENOENT') {
                        console.warn('Missing signature', file);
                    } else {
                        return Promise.reject(err);
                    }
                })
            )
    );
};
/**
 *
 * @param {string} file
 * @param {string} dest Destination folder
 * @param {bool} debug Outputs processed data in json format
 */
const convert = (file, dest, { verbose, debug, signatures }) => {
    fs
        .ensureDir(dest)
        .then(() => {
            if (file) {
                return readFile(file, dest, debug);
            }
            return [{}];
        })
        .then(logbook => fetchSignatures(logbook.dives, signatures, dest).then(() => logbook))
        .then(logbook => print(TEMPLATE, logbook, dest));
};

module.exports = convert;
