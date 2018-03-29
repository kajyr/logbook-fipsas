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

const globp = (pattern: string) =>
    new Promise((resolve, reject) =>
        glob(pattern, (err: Error, files: Array<string>) => {
            if (err) {
                return reject(err);
            }
            return resolve(files);
        })
    );

const sassp = (file: string) =>
    new Promise((resolve, reject) =>
        sass.render({ file, outputStyle: 'compressed' }, (err: Error, data: any) => {
            if (err) {
                return reject(err);
            }
            return resolve(data.css.toString());
        })
    ).catch(console.log);

const parseXml = (xml: string) =>
    new Promise((resolve, reject) =>
        parseString(xml, function(err: Error, data: string) {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        })
    );

const saveJson = (file: string, data: any) => fs.writeFile(`${file}.json`, JSON.stringify(data, null, 2));

const apply = (pattern: string, fn: Function) =>
    globp(pattern).then((files: Array<string>) => Promise.all(files.map(fn)));

const copy = (file: string, dest: string) => {
    const basename = path.basename(file);
    return fs.copy(file, path.join(dest, basename)).then(() => basename);
};

const unique = list => Array.from(new Set(list));

const strDasherize = str => str.replace(/\s+/g, '-').toLowerCase();
/*
    Molecules
*/
const buildHtml = (Logbook, styles: string, images: Array<string>, dest: string) => {
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

const build = (data, dest) =>
    buildSass().then(css => copyTemplateImages(dest).then(images => buildHtml(data, css.join('\n'), images, dest)));

const readFile = (file, dest, debug) =>
    getData(file).then(({ Divinglog }) => {
        const { Logbook } = Divinglog;
        const normalized = normalize(Logbook);

        if (debug) {
            return Promise.all([
                saveJson(path.join(dest, 'dive'), Logbook),
                saveJson(path.join(dest, 'dive-normalized'), normalized),
                saveJson(path.join(dest, 'logbook'), Divinglog)
            ]).then(() => normalized);
        }
        return normalized;
    });

const fetchSignatures = (data, signatures, dest) => {
    return Promise.all(
        unique(data.map(dive => dive.Divemaster))
            .map(strDasherize)
            .map(str => path.join(signatures, `${str}.png`))
            .map(file =>
                copy(file, dest).catch(err => {
                    if (err.code === 'ENOENT') {
                        console.warn('Missing signature', file);
                    } else {
                        return Promise.reject(err);
                    }
                })
            )
    );
};
/**
 *
 * @param {string} file
 * @param {string} dest Destination folder
 * @param {bool} debug Outputs processed data in json format
 */
const convert = (file: string, dest: string, { verbose: boolean, debug: boolean, signatures: string }) => {
    fs
        .ensureDir(dest)
        .then(() => {
            if (file) {
                return readFile(file, dest, debug);
            }
            return [{}];
        })
        .then(data => fetchSignatures(data, signatures, dest).then(() => data))
        .then(data => build(data, dest));
};

module.exports = convert;
