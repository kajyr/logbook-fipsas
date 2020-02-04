const { debugSquare } = require('../atoms/debug');
const { MAP_PROPORTIONS } = require('../constants/ara-didattica');
const LINE_COLOR = '#DEDEDE';
const PADDING = 2;

function map(doc, x, y, w, h, image) {
    doc.rect(x, y, w, h)
        .fillAndStroke('white', LINE_COLOR)
        .fillColor('black');

    const mX = x + PADDING;
    const mY = y + PADDING;
    const mW = w - 2 * PADDING;

    doc.image(image, mX, mY, { width: mW });
}

module.exports = map;
