const fs = require('fs-extra');
const glob = require('glob');
const pug = require('pug');
const { parseString } = require('xml2js');
const sass = require('node-sass');

const parse = require('date-fns/parse');
const format = require('date-fns/format');
const addMinutes = require('date-fns/add_minutes');

const DEST = './dest/';
const TEMPLATE = './template/';
const INPUT_DATA = './data/data.xml';

const NORMALIZE_BOOL_FIELDS = ['Deco', 'Rep', 'DblTank'];
const NORMALIZE_FLOAT_FIELDS = ['Tanksize', 'PresS', 'PresE', 'Divetime', 'Depth', 'Watertemp', 'Weight'];

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

const parseXml = xml =>
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

const getData = data_file => fs.readFile(data_file, 'utf8').then(parseXml);

const normalize = Logbook => {
    const [{ Dive }] = Logbook;
    return Dive.map(dive => {
        const entrydate = parse(`${dive.Divedate}:${dive.Entrytime}`);
        const diveTime = Math.round(parseFloat(dive.Divetime));
        const exitdate = addMinutes(entrydate, diveTime);
        const profile = dive.Profile[0].P;

        const boolFields = NORMALIZE_BOOL_FIELDS.reduce((acc, field) => {
            acc[field] = dive[field][0] === 'True';
            return acc;
        }, {});

        const floatFields = NORMALIZE_FLOAT_FIELDS.reduce((acc, field) => {
            acc[field] = parseFloat(dive[field][0]);
            return acc;
        }, {});

        return Object.assign({}, dive, boolFields, floatFields, {
            Depths: profile.map(p => parseFloat(p.Depth[0])),
            Temps: profile.map(p => parseFloat(p.Temp[0])),
            Times: profile.map(p => parseFloat(p.$.Time)),
            Exittime: format(exitdate, 'HH:mm'),
            Buddy: dive.Buddy.map(buddy => buddy.$.Names)
        });
    });
};

const convert = () =>
    mkdir(DEST)
        .then(() => getData(INPUT_DATA))
        .then(({ Divinglog }) => {
            const { Logbook } = Divinglog;
            const normalized = normalize(Logbook);
            const build = () =>
                buildSass().then(css => {
                    console.log(css)
                    Promise.all([buildHtml(normalized), img()]);
                })
                

            return save('dive', Logbook)
                .then(() => save('dive-normalized', normalized))
                .then(() => save('logbook', Divinglog))
                .then(build);
        });

module.exports = convert

/*

.then(() => {
                fs.watch(TEMPLATE, { recursive: true }, build);
            });
    */
