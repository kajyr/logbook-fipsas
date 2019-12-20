const { debugSquare } = require('./debug');
const { fillMissing, spread } = require('../pdfkit/lib/grid');

function block(doc, startX, startY, width, height, panelChildrenFn, debug) {
    if (debug) {
        debugSquare(doc, startX, startY, width, height, debug);
    }
    if (panelChildrenFn) {
        return panelChildrenFn(doc, startX, startY, width, height);
    }

    return children => block(doc, startX, startY, width, height, children, debug);
}

/**
 * List of percentage widths.
 * Please use integers so far
 * @param {} list
 */
const blockGenerator = (doc, curX, startY, width, height, debug) => {
    return children => block(doc, curX, startY, width, height, children, debug);
};

function columns(doc, list, startX, startY, width, height, gutter, debug) {
    let curX = startX;
    const availableWidth = width - gutter * (list.length - 1);

    return fillMissing(list, 100).map((perc, i) => {
        const bW = Math.floor((availableWidth / 100) * perc); // we might miss some decimals here
        const fn = blockGenerator(doc, curX, startY, bW, height, debug);
        curX = curX + bW + gutter;
        return fn;
    });
}

/*
    Fixed sizes in points instead of percentage
*/
function columnsFixed(doc, list, startX, startY, width, height, gutter, debug) {
    return spread(list, startX, width, gutter).map(([x, w]) =>
        blockGenerator(doc, x, startY, w, height, debug)
    );
}

function rows(startY, height, number, gutter = 0) {
    const availableH = height - gutter * (number - 1);
    const rowH = availableH / number;

    const r = Array.from({ length: number }, (_, i) => startY + (rowH + gutter) * i);

    return {
        rowH,
        r,
        debug: (doc, x, w) => r.forEach(ry => debugSquare(doc, x, ry, w, rowH))
    };
}

function rowsFixed(list, y, h, gutter) {
    return spread(list, y, h, gutter).map(([y, h]) => ({ y, h }));
}

function centerY(y, elementHeight, containerHeight) {
    return y + (containerHeight - elementHeight) / 2;
}

module.exports = { block, columns, rows, centerY, columnsFixed, rowsFixed };
