import * as fs from 'fs-extra';
import * as path from 'path';
import * as tmp from 'tmp';

import print from './lib/printer';
import signatures from './lib/signatures';

import { importer } from './lib/importer';
import exporter from './lib/pdf-exporter';
import enrich from './lib/postdata';

import { ILogBook } from './lib/logbook';

/*
    Atoms
*/

const saveJson = (file: string, data: object) =>
  fs.writeFile(`${file}.json`, JSON.stringify(data, null, 2));

/*
    Molecules
*/

const readFile = (
  file: string,
  dest: string,
  debug: boolean,
): Promise<ILogBook> => {
  return importer(file)
    .then((logbook: ILogBook) => {
      if (debug) {
        return saveJson(path.join(dest, 'logbook'), logbook).then(
          () => logbook,
        );
      }
      return logbook;
    })
    .then((logbook: ILogBook) => enrich(logbook))
    .catch((err) => {
      console.error('Something wrong: ', err.message);
    });
};

interface IConvertOptions {
  verbose?: boolean;
  debug: boolean;
  signaturesFolder: string;
  template: string;
}

/**
 *
 * @param {string} dest Destination folder
 * @param {bool} debug Outputs processed data in json format
 */
async function convert(
  dest: string,
  { verbose, debug, signaturesFolder, template }: IConvertOptions,
  file?: string,
) {
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
            empty,
          },
        ],
      }
    : await readFile(file, collector, debug);

  if (logbook.dives) {
    const availableSignatures = await signatures(
      logbook,
      signaturesFolder,
      collector,
    );
    logbook.dives = logbook.dives.map((dive) => {
      const diveMasterSignature = availableSignatures[dive.dive_master];
      return !diveMasterSignature
        ? dive
        : Object.assign({}, dive, {
            diveMasterSignature,
          });
    });
  }

  await print(templateFolder, logbook, collector);
  return exporter(collector, dest, verbose, debug);
}

export default convert;
