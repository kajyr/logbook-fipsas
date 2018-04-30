const fs = require('fs-extra');
const path = require('path');
const { copy } = require('./lib/fs');
const print = require('./lib/printer');
const { parseString } = require('xml2js');

const { normalize } = require('./lib/normalize');

const TEMPLATE = path.join(__dirname, '/templates/fipsas/src');

/*
    Atoms
*/

const parseXml = xml =>
    new Promise((resolve, reject) =>
        parseString(xml, function(err, data) {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        })
    );

const saveJson = (file, data) => fs.writeFile(`${file}.json`, JSON.stringify(data, null, 2));

const unique = list => Array.from(new Set(list));

const strDasherize = str => str.replace(/\s+/g, '-').toLowerCase();
/*
    Molecules
*/

const getData = data_file => fs.readFile(data_file, 'utf8').then(parseXml);

const readFile = (file, dest, debug) =>
    getData(file).then(({ Divinglog }) => {
        const { Logbook } = Divinglog;
        const normalized = normalize(Logbook);

        if (debug) {
            return Promise.all([
                saveJson(path.join(dest, 'dive'), Logbook),
                saveJson(path.join(dest, 'dive-normalized'), normalized),
                saveJson(path.join(dest, 'logbook'), Divinglog)
            ]).then(() => normalized);
        }
        return normalized;
    });

const fetchSignatures = (data, signatures, dest) => {
    return Promise.all(
        unique(data.map(dive => dive.Divemaster))
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
        .then(data => fetchSignatures(data, signatures, dest).then(() => data))
        .then(data => print(TEMPLATE, data, dest));
};

module.exports = convert;
