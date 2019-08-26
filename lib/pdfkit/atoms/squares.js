const { debugSquare } = require('./debug');

const SQUARE_SIDE = 13;
const LINE_COLOR = '#DEDEDE';

function squares(doc, x, y, w, h, content) {
    doc.rect(x, y, w, h)
        .fillAndStroke('white', LINE_COLOR)
        .fillColor('black');

    let vx = x;
    while (vx < x + w) {
        doc.moveTo(vx, y)
            .lineTo(vx, y + h)
            .stroke(LINE_COLOR);
        vx += SQUARE_SIDE;
    }

    let vy = y;
    while (vy < y + h) {
        doc.moveTo(x, vy)
            .lineTo(x + w, vy)
            .stroke(LINE_COLOR);
        vy += SQUARE_SIDE;
    }

    const padding = 5;
    if (content) {
        doc.fontSize(10)
            .text(content, x + padding, y + padding, {
                width: w - padding * 2,
                height: h - padding * 2
            })
            .fontSize(8);
    }
}

module.exports = { squares };
