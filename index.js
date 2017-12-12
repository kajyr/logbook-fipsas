const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const pug = require('pug');
const { parseString } = require('xml2js');
const sass = require('node-sass');

const parse = require('date-fns/parse');
const format = require('date-fns/format');
const addMinutes = require('date-fns/add_minutes');

const DEST = './';
const TEMPLATE = `${__dirname}/template/`;

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

const save = (file, data) => fs.writeFile(`${DEST}${file}.json`, JSON.stringify(data, null, 2));
const b64 = file =>
    fs.readFile(file).then(bitmap => ({ value: new Buffer(bitmap).toString('base64'), key: path.basename(file) }));
const l2o = list =>
    list.reduce((acc, cur) => {
        acc[cur.key] = cur.value;
        return acc;
    }, {});
const apply = (pattern, fn) => globp(pattern).then(files => Promise.all(files.map(fn)));
/*
    Molecules
*/
const buildHtml = (Logbook, styles, images) => {
    try {
        const compiledFunction = pug.compileFile(`${TEMPLATE}index.pug`);
        const html = compiledFunction({ Logbook, styles, images });
        return fs.writeFile(`${DEST}index.html`, html);
    } catch (e) {
        console.log(e);
        return Promise.reject(e);
    }
};

const buildSass = () => apply(`${TEMPLATE}*.scss`, sassp);
const img = () => apply(`${TEMPLATE}/imgs/*.png`, b64);
//fs.copy(`${TEMPLATE}`, `${DEST}/loghi`);

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

/**
 *
 * @param {string} file
 * @param {bool} debug Outputs processed data in json format
 */
const convert = (file, debug) =>
    getData(file).then(({ Divinglog }) => {
        const { Logbook } = Divinglog;
        const normalized = normalize(Logbook);
        const build = () =>
            buildSass().then(css => {
                return img().then(images => {
                    buildHtml(normalized, css.join('\n'), l2o(images));
                });
            });

        if (debug) {
            return Promise.all([
                save('dive', Logbook),
                save('dive-normalized', normalized),
                save('logbook', Divinglog)
            ]).then(build);
        }
        return build();
    });

module.exports = convert;
