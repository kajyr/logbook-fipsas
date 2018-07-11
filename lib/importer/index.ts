import * as fs from 'fs-extra';
import { parseString } from 'xml2js';

const read = (file: string) => fs.readFile(file, 'utf8').then(parseXml);

const importers = {
  divinglog: require('./divelog'),
  macdive: require('./macdive'),
};

function parseXml(xml: string) {
  return new Promise((resolve, reject) =>
    parseString(xml, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    }),
  );
}

export function listImporters() {
  console.log('Available importers:', Object.keys(importer));
}

export function importer(file: string) {
  return read(file).then((xml) => {
    let logbook;
    if (importers.divinglog.canImport(xml)) {
      logbook = importers.divinglog.importer(xml);
    } else {
      logbook = importers.macdive.importer(xml);
    }

    return logbook;
  });
}
