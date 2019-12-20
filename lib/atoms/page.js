/*
 * A5 === 420 × 595 points
 */
const PAGE_W = 420;
const PAGE_H = 595;

function page(doc, margins, content) {
    doc.addPage({
        size: 'A5',
        margins
    });

    const contentWidth = PAGE_W - margins.left - margins.right;
    const contentHeight = PAGE_H - margins.top - margins.bottom;

    content(doc, margins.left, margins.top, contentWidth, contentHeight);
}

module.exports = page;
