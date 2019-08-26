const { getOptions } = require('../../options');

const COLORS = ['blue', 'red', 'green', 'yellow', 'purple'];

function debugSquare(doc, startX, startY, width, height, fill) {
    const fillColor =
        typeof fill === 'string' ? fill : COLORS[Math.floor(Math.random() * COLORS.length)];

    if (getOptions().debug) {
        console.log(`${fillColor} debug box in [${startX}, ${startY}]`);
    }
    doc.rect(startX, startY, width, height)
        .fillOpacity(0.3)
        .fill(fillColor)
        .fillOpacity(1)
        .fillColor('black');
}

module.exports = {
    debugSquare
};