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

const save = (file, data) => fs.writeFile(`${DEST}${file}.json`, JSON.stringify(data, null, 2));

/*
    Molecules
*/
const buildHtml = Logbook => {
    try {
        const compiledFunction = pug.compileFile(`${TEMPLATE}index.pug`);
        const html = compiledFunction({ Logbook });
        return fs.writeFile(`${DEST}index.html`, html);
    } catch (e) {
        console.log(e);
        return Promise.reject(e);
    }
};

const buildSass = () => globp(`${TEMPLATE}*.scss`).then(files => Promise.all(files.map(sassp)));

const img = () => fs.copy(`${TEMPLATE}/loghi`, `${DEST}/loghi`);

const getData = data_file => fs.readFile(data_file, 'utf8').then(parse);

const normalize = Logbook => {
    const [{ Dive }] = Logbook
    return Dive.map(dive => {
        const profile = dive.Profile[0].P;

        return Object.assign({}, dive, {
            Depths: profile.map(p => parseFloat(p.Depth[0])),
            Temps: profile.map(p => parseFloat(p.Temp[0])),
            Times: profile.map(p => parseFloat(p.$.Time))
        });
    });
};

mkdir(DEST)
    .then(() => getData(INPUT_DATA))
    .then(({ Divinglog }) => {
        const { Logbook } = Divinglog;
        const normalized = normalize(Logbook);
        const build = () =>
            Promise.all([buildHtml(normalized), buildSass(), img()]).then(() => console.log('-- Build ok'));

        save('dive', Logbook)
            .then(() => save('dive-normalized', normalized))
            .then(() => save('logbook', Divinglog))
            .then(build)
            .then(() => {
                fs.watch(TEMPLATE, { recursive: true }, build);
            });
    });
