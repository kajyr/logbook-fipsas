const { block } = require('../atoms/grid');
const panel = require('../atoms/panel');
const { title } = require('../atoms/titles');
const { squares } = require('../atoms/squares');
const { scale } = require('../pdfkit/lib/charts');
const { timefromSeconds } = require('../format');

const CHART_LINES_COLORS = ['#5B7AB7', '#362455'];

const chartComponent = (box, samples) =>
    box((doc, x, y, w, h) => {
        //y Axe
        const depths = samples.map(s => s.depth);
        const minDepth = 0;
        const maxDepth = Math.ceil(Math.max(...depths));
        doc.fontSize(6);
        const widthOfYLabels = 9; // two digits..
        const yLabelOpts = { width: widthOfYLabels, align: 'right' };
        const lineH = doc.currentLineHeight();
        const bottomLabel = y + h - lineH;
        const axisOriginY = y + h - lineH * 1.5;
        doc.text(minDepth, x, y, yLabelOpts);
        doc.text(maxDepth, x, bottomLabel - lineH, yLabelOpts);
        const axisOriginX = x + widthOfYLabels + 3;
        doc.moveTo(axisOriginX, y)
            .lineTo(axisOriginX, axisOriginY)
            .stroke();

        // x Axe
        const minTime = 0;
        const maxTime = samples[samples.length - 1].time;

        doc.text(minTime, axisOriginX, bottomLabel);
        doc.text(timefromSeconds(maxTime), x + w - widthOfYLabels * 2, bottomLabel);
        doc.moveTo(axisOriginX, axisOriginY)
            .lineTo(x + w, axisOriginY)
            .stroke();
        doc.fontSize(8);

        //chart

        const chart = block(doc, axisOriginX + 2, y, x + w - axisOriginX - 2, axisOriginY - y - 2);

        chart((doc, x, y, w, h) => {
            const xScale = scale(0, maxTime, x + w, x);
            const yScale = scale(0, maxDepth, y + h, y);

            doc.moveTo(x, y);
            samples.forEach(s => {
                doc.lineTo(xScale(s.time), yScale(s.depth));
            });
            doc.stroke(CHART_LINES_COLORS[0]);
            doc.strokeColor('black');
        });
    });

const component = (doc, x, y, w, h, dive) =>
    panel(doc, x, y, w, h, 3, (doc, x, y, w, h) => {
        title(doc, "PROFILO DELL'IMMERSIONE", x, y, 9, { width: w });

        const boxY = y + 15;
        const boxH = h - 15;
        const boxPadding = 2;
        doc.rect(x, boxY, w, boxH)
            .fill('white')
            .fillColor('black');

        const chartBox = block(
            doc,
            x + boxPadding,
            boxY + boxPadding,
            w - 2 * boxPadding,
            boxH - 2 * boxPadding
        );

        const { samples } = dive;

        if (samples.length) {
            chartComponent(chartBox, samples);
        } else {
            chartBox(squares);
        }
    });

module.exports = component;
