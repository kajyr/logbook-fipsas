const { centerY } = require('./text');
const { LINE_WIDTH } = require('../constants/ara-didattica');

function input(doc, x, y, w, h, value, options = {}) {
    const { fullBorder } = options;
    const fieldborderY = y + h;

    const hLine = LINE_WIDTH / 2;

    if (!fullBorder) {
        doc.rect(x, y, w, h).fill('white');

        doc.moveTo(x, fieldborderY)
            .lineTo(x + w, fieldborderY)
            .stroke();
    } else {
        doc.rect(x + hLine, y + hLine, w - LINE_WIDTH, h - LINE_WIDTH).fillAndStroke(
            'white',
            'black'
        );
    }
    doc.fillColor('black');

    if (!!value) {
        doc.text(value, x + 3, centerY(doc, y, h), { width: w - 3, height: h, ellipsis: true });
    }
}

module.exports = { input };
