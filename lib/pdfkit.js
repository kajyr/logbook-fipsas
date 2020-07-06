const fs = require('fs-extra');
const path = require('path');
const PDFDocument = require('pdfkit');

//const page = require('./pages/aria-nx-base');
const page = require('./pages/ara-didattica');

const PACKAGE_PATH = path.normalize(path.join(__dirname, '../package.json'));

function init(logbook, dest) {
    const package = JSON.parse(fs.readFileSync(PACKAGE_PATH, 'utf8'));

    // Create a document
    const doc = new PDFDocument({
        autoFirstPage: false,
        permissions: {
            printing: 'highResolution',
            modifying: false,
        },
    });
    doc.pipe(fs.createWriteStream(dest));

    // Set some meta data
    doc.info['Title'] = 'FIPSAS Logbook';

    doc.info['Author'] = 'Carlo Panzi';

    doc.font('Helvetica');
    doc.fontSize(12);

    logbook.dives.reverse().forEach((dive) => {
        try {
            page(doc, dive, { version: package.version });
        } catch (e) {
            console.log('error', e);
        }
    });

    // Finalize PDF file
    doc.end();
}

module.exports = init;
