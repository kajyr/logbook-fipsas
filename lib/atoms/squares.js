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

    const content_w = w - padding * 2;
    const content_h = h - padding * 2;

    if (typeof content === 'function') {
        content(doc, x + padding, y + padding, content_w, content_h);
    } else if (typeof content === 'string') {
        doc.fontSize(10)
            .text(content, x + padding, y + padding, {
                width: content_w,
                height: content_h
            })
            .fontSize(8);
    }
}

module.exports = { squares };
