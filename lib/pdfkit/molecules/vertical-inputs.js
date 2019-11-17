const { centerY } = require('../atoms/text');
const { LINE_WIDTH } = require('../constants/ara-didattica');

const vInputs = (doc, x, y, w, rowH, values) => {
    /*     debugSquare(doc, x, y, w, h);
     */ const h = rowH * values.length;
    const hLine = LINE_WIDTH / 2;

    doc.rect(x + hLine, y + hLine, w - LINE_WIDTH, h - LINE_WIDTH).fillAndStroke('white', 'black');
    doc.fillColor('black');
    values.forEach((v, index) => {
        const lineY = y + rowH * index;
        if (index > 0) {
            doc.moveTo(x, lineY)
                .lineTo(x + w, lineY)
                .stroke();
        }
        if (v) {
            doc.text(v, x + 3, centerY(doc, lineY, rowH), {
                width: w - 3,
                height: rowH,
                ellipsis: true
            });
        }
    });
};

module.exports = { vInputs };
