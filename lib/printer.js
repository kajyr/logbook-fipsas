const pug = require('pug');
const fs = require('fs-extra');
const { copy, apply } = require('./fs');
const path = require('path');
const sass = require('node-sass');

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
const buildHtml = (templateDir, Logbook, styles, images, dest) => {
    try {
        const compiledFunction = pug.compileFile(path.join(templateDir, 'index.pug'));
        const html = compiledFunction({ Logbook, styles, images });
        return fs.writeFile(path.join(dest, 'index.html'), html);
    } catch (e) {
        console.error(e);
        return Promise.reject(e);
    }
};
const copyTemplateImages = (templateDir, dest) =>
    apply(path.join(templateDir, `/imgs/*.png`), image => copy(image, dest));

const build = (templateDir, data, dest) => {
    return buildSass(templateDir).then(css =>
        copyTemplateImages(dest).then(images => buildHtml(templateDir, data, css.join('\n'), images, dest))
    );
};

module.exports = build;
