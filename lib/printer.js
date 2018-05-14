const fs = require('fs-extra');
const { copy, apply } = require('./fs');
const path = require('path');
const sass = require('node-sass');
const Mustache = require('mustache');

const sassp = file =>
    new Promise((resolve, reject) =>
        sass.render({ file, outputStyle: 'compressed' }, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data.css.toString());
        })
    ).catch(console.error);

const buildSass = templateDir => apply(path.join(templateDir, '*.scss'), sassp);
const buildHtml = (templateDir, logbook, styles, images, dest) => {
    return fs
        .readFile(path.join(templateDir, 'index.mustache'), 'utf8')
        .then(template => Mustache.render(template, { logbook, styles, images }))
        .then(html => fs.writeFile(path.join(dest, 'index.html'), html));
};
const copyTemplateImages = (templateDir, dest) =>
    apply(path.join(templateDir, 'imgs', '*.png'), image => copy(image, dest));

const build = (templateDir, logbook, dest) => {
    return buildSass(templateDir)
        .then(css =>
            copyTemplateImages(templateDir, dest).then(images =>
                buildHtml(templateDir, logbook, css.join('\n'), images, dest)
            )
        )
        .then(() => dest);
};

module.exports = build;
