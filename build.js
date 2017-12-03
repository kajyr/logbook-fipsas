const fs = require('fs-extra');
const glob = require('glob');
const pug = require('pug');
const { parseString } = require('xml2js');
const sass = require('node-sass');

const DEST = './dest/';
const TEMPLATE = './template/';
const INPUT_DATA = './data/data.xml';

/*
    Atoms
*/
const mkdir = path =>
    fs.mkdir(path, 0777).catch(err => {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    });

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
        sass.render({ file }, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        })
    );
const parse = xml =>
    new Promise((resolve, reject) =>
        parseString(xml, function(err, data) {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        })
    );

/*
    Molecules
*/
const build = Logbook => {
    const compiledFunction = pug.compileFile(`${TEMPLATE}index.pug`);
    const html = compiledFunction({ Logbook });

    return fs
        .writeFile(`${DEST}index.html`, html)
        .then(() => {
            console.log('The file has been saved!');
            return globp(`${TEMPLATE}*.css`);
        })
        .then(files => {
            console.log('copying ', files);
            return Promise.all(files.map(file => fs.copy(file, file.replace(TEMPLATE, DEST)))).then(files => {
                console.log('CSS copied');
            });
        });
};

const getData = data_file => fs.readFile(data_file, 'utf8').then(parse);

mkdir(DEST)
.then(() => getData(INPUT_DATA))
.then(({ Divinglog }) => {
    const { Logbook } = Divinglog;
    const [{ Dive }] = Logbook;
    fs.writeFile(`${DEST}data.json`, JSON.stringify(Dive, null, 2))
    .then(() => build(Dive))
    .then(() => {
        fs.watch(TEMPLATE, () => build(Dive));
    });
});

