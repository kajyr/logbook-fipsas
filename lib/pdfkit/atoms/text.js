function centerY(doc, startY, height) {
    return startY + (height - doc.currentLineHeight()) / 2;
}

function centerX(doc, label, height) {
    return startY + (height - doc.currentLineHeight()) / 2;
}

module.exports = { centerX, centerY };
