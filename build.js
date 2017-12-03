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
        sass.render({ file, outputStyle: 'compact' }, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        })
    )
.then(data => fs.writeFile(file.replace(TEMPLATE, DEST).replace(/\.s.ss/i, '.css'), data.css))
        .catch(console.log);

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
const buildHtml = Logbook => {
    const compiledFunction = pug.compileFile(`${TEMPLATE}index.pug`);
    const html = compiledFunction({ Logbook });
    return fs.writeFile(`${DEST}index.html`, html);
};

const buildSass = () => globp(`${TEMPLATE}*.scss`).then(files => Promise.all(files.map(sassp)));

const getData = data_file => fs.readFile(data_file, 'utf8').then(parse);

mkdir(DEST)
    .then(() => getData(INPUT_DATA))
    .then(({ Divinglog }) => {
        const { Logbook } = Divinglog;
        const [{ Dive }] = Logbook;
        const build = () => Promise.all([buildHtml(Dive), buildSass()]).then(() => console.log('-- Build ok'));

        fs
            .writeFile(`${DEST}data.json`, JSON.stringify(Dive, null, 2))
            .then(build)
            .then(() => {
                fs.watch(TEMPLATE, { recursive: true }, build);
            });
    });