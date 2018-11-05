import * as path from 'path';
import { copy } from './fs';
import { IDive, ILogbook } from './logbook';

const unique = (list: string[]): string[] => Array.from(new Set(list));

const strDasherize = (str: string): string => str.replace(/\s+/g, '-').toLowerCase();

function signatures(logbook: ILogbook, folder: string, dest: string): Promise<string[]> {
    const fetched = Promise.all(
        unique(logbook.dives.filter((dive: IDive): boolean => !!dive.dive_master)
            .map((dive: IDive): string => dive.dive_master)).map((name) => {
                const file = path.join(folder, `${strDasherize(name)}.png`);
                return copy(file, dest)
                    .then((filePath: string) => ({ name, filePath }))
                    .catch((err: any): any => {
                        if (err.code === 'ENOENT') {
                            console.warn('Missing signature', file);
                        } else {
                            Promise.reject(err);
                        }
                    });
            }),
    )
        .then((all) =>
            all.filter((f) => !!f).reduce((acc, cur) => {
                acc[cur.name] = cur.filePath;
                return acc;
            }, {}),
        );

    return fetched;
}

export default signatures;
