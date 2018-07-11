import * as fs from 'fs-extra';
import * as glob from 'glob';
import * as path from 'path';

const globp = (pattern: string): Promise<string[]> =>
  new Promise((resolve, reject) =>
    glob(pattern, (err, files) => {
      if (err) {
        return reject(err);
      }
      return resolve(files);
    }),
  );

export function copy(file: string, dest: string) {
  const basename = path.basename(file);
  return fs.copy(file, path.join(dest, basename)).then(() => basename);
}

export function apply(pattern: string, fn: (name: string) => Promise<any>) {
  return globp(pattern).then((files) => Promise.all(files.map(fn)));
}
