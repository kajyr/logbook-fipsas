const { sign } = require('../pdfkit/lib/dotSignature');

function footer(doc, x, y, width, height, options) {
    doc.fontSize(8).text('(C) FIPSAS 2019', x, y, { width, align: 'center' });

    if (options) {
        const signature = sign(options);
        doc.fontSize(8).text(signature, x, y, { width, align: 'right' });
    }
}

module.exports = footer;
