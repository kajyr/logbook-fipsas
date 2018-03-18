const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const pug = require('pug');
const { parseString } = require('xml2js');
const sass = require('node-sass');

const { normalize } = require('./lib/normalize');

const TEMPLATE = `${__dirname}/template/`;

/*
    Atoms
*/

const globp = pattern =>
    new Promise((resolve, reject) =>
        glob(pattern, (err, files) => {
            if (err) {
                return reject(err);
            }
            return resolve(files);
        })
    );

const sassp = file =>
    new Promise((resolve, reject) =>
        sass.render({ file, outputStyle: 'compressed' }, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data.css.toString());
        })
    ).catch(console.log);

const parseXml = xml =>
    new Promise((resolve, reject) =>
        parseString(xml, function(err, data) {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        })
    );

const saveJson = (file, data) => fs.writeFile(`${file}.json`, JSON.stringify(data, null, 2));

const apply = (pattern, fn) => globp(pattern).then(files => Promise.all(files.map(fn)));

const copy = (file, dest) => {
    const basename = path.basename(file);
    return fs.copy(file, path.join(dest, basename)).then(() => basename);
};
/*
    Molecules
*/
const buildHtml = (Logbook, styles, images, dest) => {
    try {
        const compiledFunction = pug.compileFile(`${TEMPLATE}index.pug`);
        const html = compiledFunction({ Logbook, styles, images });
        return fs.writeFile(path.join(dest, 'index.html'), html);
    } catch (e) {
        console.log(e);
        return Promise.reject(e);
    }
};

const buildSass = () => apply(TEMPLATE + '*.scss', sassp);

const copyTemplateImages = dest => apply(`${TEMPLATE}/imgs/*.png`, image => copy(image, dest));

const getData = data_file => fs.readFile(data_file, 'utf8').then(parseXml);

/**
 *
 * @param {string} file
 * @param {string} dest Destination folder
 * @param {bool} debug Outputs processed data in json format
 */
const convert = (file, dest, debug) =>
    getData(file).then(({ Divinglog }) => {
        const { Logbook } = Divinglog;
        const normalized = normalize(Logbook);
        const build = () =>
            fs
                .ensureDir(dest)
                .then(buildSass)
                .then(css =>
                    copyTemplateImages(dest).then(images => buildHtml(normalized, css.join('\n'), images, dest))
                );

        if (debug) {
            return Promise.all([
                saveJson(path.join(dest, 'dive'), Logbook),
                saveJson(path.join(dest, 'dive-normalized'), normalized),
                saveJson(path.join(dest, 'logbook'), Divinglog)
            ]).then(build);
        }
        return build();
    });

module.exports = convert;
