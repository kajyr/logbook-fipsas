const fs = require('fs-extra');
const glob = require('glob');
const pug = require('pug');
const { parseString } = require('xml2js');

const DEST = './dest/';
const TEMPLATE = './template/';
const INPUT_DATA = './data/data.xml';

function mkdir(path, cb) {
    fs.mkdir(path, 0777, function(err) {
        if (err) {
            if (err.code == 'EEXIST')
                cb(null); // ignore the error if the folder already exists
            else cb(err); // something else went wrong
        } else cb(null); // successfully created folder
    });
}

const build = (Logbook) => {
    const compiledFunction = pug.compileFile(`${TEMPLATE}index.pug`);
    const html = compiledFunction({ Logbook });

    fs.writeFile(`${DEST}index.html`, html, err => {
        if (err) throw err;
        console.log('The file has been saved!');
        glob(`${TEMPLATE}*.css`, function(err, files) {
            Promise.all(files.map(file => fs.copy(file, file.replace(TEMPLATE, DEST)))).then(files => {
                console.log('CSS copied');
            });
        });
    });
};

const xml = fs.readFileSync(INPUT_DATA, 'utf8');

parseString(xml, function(err, { Divinglog }) {
    
    const {Logbook } = Divinglog
    const [ {Dive} ] = Logbook

    fs.writeFileSync(`${DEST}data.json`, JSON.stringify(Dive, null, 2))

    mkdir(DEST, err => {
        build(Dive);

        fs.watch(TEMPLATE, () => build(Dive));
    });
});
