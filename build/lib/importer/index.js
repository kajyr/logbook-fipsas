"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const xml2js_1 = require("xml2js");
const read = (file) => fs.readFile(file, 'utf8').then(parseXml);
const importers = {
    divinglog: require('./divelog'),
    macdive: require('./macdive'),
};
function parseXml(xml) {
    return new Promise((resolve, reject) => xml2js_1.parseString(xml, (err, data) => {
        if (err) {
            return reject(err);
        }
        return resolve(data);
    }));
}
function listImporters() {
    console.log('Available importers:', Object.keys(importer));
}
exports.listImporters = listImporters;
function importer(file) {
    return read(file).then((xml) => {
        let logbook;
        if (importers.divinglog.canImport(xml)) {
            logbook = importers.divinglog.importer(xml);
        }
        else {
            logbook = importers.macdive.importer(xml);
        }
        return logbook;
    });
}
exports.importer = importer;
