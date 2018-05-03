const fs = require('fs-extra');
const { parseString } = require('xml2js');
const Joi = require('joi');
const { LogbookSchema } = require('../logbook');

const read = data_file => fs.readFile(data_file, 'utf8').then(parseXml);

const importers = {
    divinglog: require('./divelog'),
    macdive: require('./macdive')
};

function parseXml(xml) {
    return new Promise((resolve, reject) =>
        parseString(xml, function(err, data) {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        })
    );
}

function listImporters() {
    console.log('Available importers:', Object.keys(importer));
}

function importer(file) {
    return read(file).then(xml => {
        let logbook;
        if (importers.divinglog.canImport(xml)) {
            logbook = importers.divinglog.importer(xml);
        } else {
            logbook = importers.macdive.importer(xml);
        }

        const result = Joi.validate(logbook, LogbookSchema);
        if (result.error) {
            result.error.details.forEach(detail => console.error(detail.message));
        }
        return logbook;
    });
}

module.exports = { importer, listImporters };
