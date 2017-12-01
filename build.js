const fs = require('fs-extra');
const glob = require('glob');
const pug = require('pug');
// Compile the source code

const DEST = './dest/';
const TEMPLATE = './template/';

function mkdir(path, cb) {
    fs.mkdir(path, 0777, function(err) {
        if (err) {
            if (err.code == 'EEXIST')
                cb(null); // ignore the error if the folder already exists
            else cb(err); // something else went wrong
        } else cb(null); // successfully created folder
    });
}


const build = () => {
    const compiledFunction = pug.compileFile(`${TEMPLATE}index.pug`);
    const html = compiledFunction({ name: 'Timothy' });
    
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

mkdir(DEST, err => {
    build();

    fs.watch(TEMPLATE, build);
});
