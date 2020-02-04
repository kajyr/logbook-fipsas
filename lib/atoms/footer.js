const { sign } = require('../pdfkit/lib/dotSignature');
const { centerY } = require('./text');

function footer(doc, x, y, width, height, options) {
    doc.fontSize(8);

    const cY = centerY(doc, y, height);

    doc.text('(C) FIPSAS 2019', x, cY, { width, align: 'center' });

    if (options) {
        const signature = sign(options);
        doc.text(signature, x, cY, { width, align: 'right' });
    }
}

module.exports = footer;
