const COLOR_PANEL_BG = '#ccc';

function panel(doc, startX, startY, width, height, padding, panelChildrenFn) {
    doc.rect(startX, startY, width, height)
        .fillAndStroke(COLOR_PANEL_BG, 'black')
        .fillColor('black');

    panelChildrenFn(
        doc,
        startX + padding,
        startY + padding,
        width - 2 * padding,
        height - 2 * padding
    );

    return [startX + width, startY + height];
}

module.exports = panel;
