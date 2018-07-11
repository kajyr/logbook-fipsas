"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const Mustache = require("mustache");
const path = require("path");
const fs_1 = require("./fs");
const buildHtml = (templateDir, logbook, images, dest) => {
    return fs
        .readFile(path.join(templateDir, 'index.mustache'), 'utf8')
        .then((template) => Mustache.render(template, { logbook, images }))
        .then((html) => fs.writeFile(path.join(dest, 'index.html'), html));
};
const copyTemplateFiles = (templateDir, dest) => Promise.all([
    fs_1.apply(path.join(templateDir, 'imgs', '*.png'), (file) => fs_1.copy(file, dest)),
    fs_1.apply(path.join(templateDir, '*.css'), (file) => fs_1.copy(file, dest)),
]);
const build = (templateDir, logbook, dest) => {
    return copyTemplateFiles(templateDir, dest)
        .then((images) => buildHtml(templateDir, logbook, images, dest))
        .then(() => dest);
};
exports.default = build;
