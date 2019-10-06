const format = require('date-fns/format');
const { debugSquare } = require('../atoms/debug');
const { centerY } = require('../atoms/text');
const { input } = require('../atoms/input');
const labelF = require('../atoms/label');

function field(doc, startX, startY, width, height, label, value, options = {}) {
    const { labelSpacing = 10, labelWidth, sublabel, fullBorder, bold } = options;

    const sublabelWidth = sublabel ? doc.widthOfString(sublabel) : 0;

    if (bold) {
        doc.font('Helvetica-Bold');
    }
    const mainlabelWidth = doc.widthOfString(label);

    const labelW = labelWidth ? labelWidth : Math.max(mainlabelWidth, sublabelWidth) + labelSpacing;

    const cY = centerY(doc, startY, height);
    doc.text(label, startX, sublabel ? startY : cY, { width: labelW, align: 'right' }).font(
        'Helvetica'
    );

    if (sublabel) {
        doc.text(sublabel, startX, startY + height / 2, {
            width: labelW,
            align: 'right'
        }).fontSize(8);
    }

    const fieldX = startX + labelW + 3;
    const fieldW = width - labelW - 3;

    const fieldH = height - 1;

    input(doc, fieldX, startY, fieldW, fieldH, value, {
        fullBorder
    });
}

const field_date = (doc, startX, startY, width, height, label, value) =>
    field(
        doc,
        startX,
        startY,
        width,
        height,
        label,
        value && format(new Date(value), 'dd-MM-yyyy')
    );

function checkbox(doc, startX, startY, width, height, label, checked) {
    const lineHeight = doc.currentLineHeight();

    const border = 0.8;
    const squareSide = lineHeight - 2 * border;
    const checkStartX = startX + width - squareSide - border;

    doc.rect(checkStartX, startY + border, squareSide, squareSide)
        .fillAndStroke('white', 'black')
        .fillColor('black');

    if (checked) {
        doc.text('x', checkStartX, startY, { width: squareSide, align: 'center' });
    }

    doc.font('Helvetica-Oblique')
        .text(label, startX, startY, { width: checkStartX - startX - 2, align: 'right' })
        .font('Helvetica');
}

function fieldWithUpperLabel(doc, startX, startY, width, height, label, value, options = {}) {
    const { sublabel, bold } = options;
    const labelAlign = sublabel ? 'left' : 'center';
    doc.fontSize(6);
    if (bold) {
        doc.font('Helvetica-Bold');
    }
    const lineHeight = doc.currentLineHeight() + 2;
    doc.text(label, startX, startY, { width, align: labelAlign }).font('Helvetica');
    const boxY = startY + lineHeight;
    const boxH = height - lineHeight - 2;

    if (sublabel) {
        doc.fontSize(5).text(sublabel, startX + 1, startY, { width, align: 'right' });
    }

    doc.fontSize(8);

    input(doc, startX, startY + lineHeight, width, boxH, value, {
        fullBorder: true
    });
}

function fieldWithLowerSubLabel(doc, x, y, w, label, value, options = {}) {
    const inputHeight = 10;
    const { labelWidth, labelSpacing = 3, sublabel } = options;
    const labelW = labelWidth ? labelWidth : label ? doc.widthOfString(label) : 0;

    if (!!label) {
        doc.text(label, x, centerY(doc, y, inputHeight), { width: labelW });
    }

    const inputX = x + labelW + (label ? labelSpacing : 0);
    const inputW = w - labelW - (label ? labelSpacing : 0);

    input(doc, inputX, y, inputW, inputHeight, value);

    doc.fontSize(5)
        .text(sublabel, inputX, y + inputHeight + 2, { width: inputW, align: 'center' })
        .fontSize(8);
}

function fieldWithFixedInput(doc, x, y, w, h, label, value, options = {}) {
    const { sublabel, inputWidth } = options;

    const labelW = w - inputWidth - 2;

    labelF(doc, label, sublabel, x, y, labelW, h);

    input(doc, x + labelW + 2, y, inputWidth, h, value);
}
module.exports = {
    field,
    field_date,
    checkbox,
    fieldWithUpperLabel,
    fieldWithLowerSubLabel,
    fieldWithFixedInput
};
