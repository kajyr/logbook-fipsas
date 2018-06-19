const fs = require('fs-extra');
const { copy, apply } = require('./fs');
const path = require('path');
const Mustache = require('mustache');

const buildHtml = (templateDir, logbook, images, dest) => {
    return fs
        .readFile(path.join(templateDir, 'index.mustache'), 'utf8')
        .then(template => Mustache.render(template, { logbook, images }))
        .then(html => fs.writeFile(path.join(dest, 'index.html'), html));
};

const copyTemplateFiles = (templateDir, dest) =>
    Promise.all([
        apply(path.join(templateDir, 'imgs', '*.png'), file => copy(file, dest)),
        apply(path.join(templateDir, '*.css'), file => copy(file, dest))
    ]);

const build = (templateDir, logbook, dest) => {
    return copyTemplateFiles(templateDir, dest)
        .then(images => buildHtml(templateDir, logbook, images, dest))

        .then(() => dest);
};

module.exports = build;
