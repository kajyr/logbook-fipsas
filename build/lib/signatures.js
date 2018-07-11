"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs_1 = require("./fs");
const unique = (list) => Array.from(new Set(list));
const strDasherize = (str) => str.replace(/\s+/g, '-').toLowerCase();
function signatures(logbook, folder, dest) {
    const fetched = Promise.all(unique(logbook.dives.filter((dive) => !!dive.dive_master)
        .map((dive) => dive.dive_master)).map((name) => {
        const file = path.join(folder, `${strDasherize(name)}.png`);
        return fs_1.copy(file, dest)
            .then((filePath) => ({ name, filePath }))
            .catch((err) => {
            if (err.code === 'ENOENT') {
                console.warn('Missing signature', file);
            }
            else {
                Promise.reject(err);
            }
        });
    }))
        .then((all) => all.filter((f) => !!f).reduce((acc, cur) => {
        acc[cur.name] = cur.filePath;
        return acc;
    }, {}));
    return fetched;
}
exports.default = signatures;
