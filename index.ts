import * as fs from 'fs-extra';
import * as path from 'path';
import * as tmp from 'tmp';

import { saveJson } from './lib/fs';
import print from './lib/printer';
import signatures from './lib/signatures';

import { importer } from './lib/importer';
import exporter from './lib/pdf-exporter';
import enrich from './lib/postdata';

import { EMPTY_LOGBOOK, ILogbook, IEmptyLogbook } from './lib/logbook';

/*
    Atoms
*/

/*
    Molecules
*/

async function readFile(
  file: string,
  dest: string,
  debug: boolean,
): Promise<ILogbook> {
  return importer(file)
    .then(async (logbook: ILogbook): Promise<ILogbook> => {
      if (debug) {
        await saveJson(dest, 'logbook', logbook);
      }
      return logbook;
    })
    .then(enrich);
}

interface IConvertOptions {
  verbose?: boolean;
  debug: boolean;
  signaturesFolder: string;
  template: string;
}

async function convert(
  file: string,
  dest: string,
  options: IConvertOptions,
) {

  const tmpDir = tmp.dirSync({ unsafeCleanup: !options.debug, keep: options.debug });
  const collector = tmpDir.name;

  if (options.verbose) {
    console.log('Collector dir: ', collector);
  }

  const logbook = await readFile(file, collector, options.debug);
  if (logbook.dives) {
    const availableSignatures = await signatures(
      logbook,
      options.signaturesFolder,
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

  return process(logbook, dest, collector, options);
}

export async function convertEmpty(dest: string, options: IConvertOptions) {
  console.log('Rendering empty template');

  const tmpDir = tmp.dirSync({ unsafeCleanup: !options.debug, keep: options.debug });
  const collector = tmpDir.name;

  if (options.verbose) {
    console.log('Collector dir: ', collector);
  }

  if (options.debug) {
    await saveJson(collector, 'logbook', EMPTY_LOGBOOK);
  }

  return process(EMPTY_LOGBOOK, dest, collector, options);
}

async function process(
  logbook: ILogbook | IEmptyLogbook,
  dest: string, collector: string, { verbose, debug, signaturesFolder, template }: IConvertOptions) {
  const templateFolder = path.join(__dirname, '..', 'templates', template);

  await print(templateFolder, logbook, collector);
  return exporter(collector, dest, verbose, debug);
}

export default convert;
