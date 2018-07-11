"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const glob = require("glob");
const path = require("path");
const globp = (pattern) => new Promise((resolve, reject) => glob(pattern, (err, files) => {
    if (err) {
        return reject(err);
    }
    return resolve(files);
}));
function copy(file, dest) {
    const basename = path.basename(file);
    return fs.copy(file, path.join(dest, basename)).then(() => basename);
}
exports.copy = copy;
function apply(pattern, fn) {
    return globp(pattern).then((files) => Promise.all(files.map(fn)));
}
exports.apply = apply;
