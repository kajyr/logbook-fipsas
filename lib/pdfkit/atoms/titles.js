function title(doc, label, x, y, fontSize = 12, options) {
    doc.fontSize(fontSize)
        .font('Helvetica-Bold')
        .text(label, x, y, options)
        .font('Helvetica')
        .fontSize(8);
}

module.exports = { title };
