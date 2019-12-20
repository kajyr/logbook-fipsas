const header = require('../atoms/header');
const footer = require('../atoms/footer');
const panel = require('../atoms/panel');
const { field, field_date, checkbox, fieldWithUpperLabel } = require('../molecules/field');
const { block, columns, rows, centerY } = require('../atoms/grid');
const { title } = require('../atoms/titles');
const { squares } = require('../atoms/squares');
const { debugSquare } = require('../atoms/debug');
const condizioniAmbientali = require('../molecules/condizioni-ambientali');
const { time } = require('../../format');
/*
 * A5 === 420 × 595 points
 */
const PAGE_W = 420;
const PAGE_H = 595;

const MARGINS = { top: 5, bottom: 20, left: 42, right: 17 };
const FOOTER_HEIGHT = 45;

const FIELD_BIG_HEIGHT = 15;

const FONT_SIZE_TITLES = 12;
const FONT_SIZE_FIELDS = 8;

/**
 * This logbook layout assumes only one gas.
 */
function page(doc, dive) {
    doc.addPage({
        size: 'A5'
    });

    doc.lineWidth(0.8);

    const contentWidth = PAGE_W - MARGINS.left - MARGINS.right;

    const [nextX, nextY] = header(
        doc,
        'SCHEDA ARIA - NITROX BASE',
        MARGINS.left,
        MARGINS.top,
        contentWidth,
        30
    );

    /* DIVE RELATED THINGS */
    const [gas] = dive.gases;
    const tankVolume = gas.tankSize;

    const panelH = PAGE_H - nextY - FOOTER_HEIGHT - MARGINS.bottom;

    panel(doc, nextX, nextY, contentWidth, panelH, 5, (doc, startX, startY, width, height) => {
        const fieldPadding = 5;
        let nextY = startY;
        {
            // First group
            const columnMargin = 10;

            const secondLineY = startY + FIELD_BIG_HEIGHT + fieldPadding;

            const [first, second] = columns(
                doc,
                [40, 60],
                startX,
                startY,
                width,
                FIELD_BIG_HEIGHT * 2 + fieldPadding,
                columnMargin
            );
            doc.fontSize(10);
            first((doc, x, y, w, h) => {
                field(doc, x, y, w, FIELD_BIG_HEIGHT, 'Immersione N°', dive.number);
                field_date(doc, x, secondLineY, w, FIELD_BIG_HEIGHT, 'Data', dive.date);
            });

            second((doc, x, y, w, h) => {
                field(doc, x, y, w, FIELD_BIG_HEIGHT, 'Luogo', dive.location.place, {
                    labelWidth: 37
                });
                field(doc, x, secondLineY, w, FIELD_BIG_HEIGHT, 'Punto', dive.location.site, {
                    labelWidth: 37
                });
            });

            nextY = secondLineY + FIELD_BIG_HEIGHT + 10;
        }

        {
            // Second group
            const groupHeight = 80;
            const [first, second] = columns(doc, [56, 44], startX, nextY, width, groupHeight, 5);
            first((doc, startX, startY, width, height) => {
                const headerLineHeight = doc.currentLineHeight();
                title(doc, 'Condizioni Meteo Marine', startX, startY);

                const { r, rowH } = rows(
                    startY + headerLineHeight + 5,
                    height - headerLineHeight,
                    4,
                    5
                );

                condizioniAmbientali(doc, startX, startY, width, height, r, rowH, dive);
            });
            second((doc, startX, startY, width, height) => {
                const headerLineHeight = doc.currentLineHeight();
                title(doc, 'Attrezzatura', startX, startY);

                const { r, rowH } = rows(
                    startY + headerLineHeight + 5,
                    height - headerLineHeight,
                    3,
                    5
                );

                doc.fontSize(FONT_SIZE_FIELDS);

                const [muta, zavorra] = columns(doc, [55, 45], startX, r[0], width, rowH, 5);
                const [bombola, gas] = columns(doc, [40, 60], startX, r[1], width, rowH, 5);

                const fieldOptions = { labelSpacing: 2 };

                muta((doc, x, y, w, h) => {
                    let mutaValue = '';
                    if (dive.gear.find(g => g.type === 'Wetsuit')) {
                        mutaValue = 'umida';
                    } else if (dive.gear.find(g => g.type === 'Drysuit')) {
                        mutaValue = 'stagna';
                    }
                    field(doc, x, y, w, h, 'muta', mutaValue, fieldOptions);
                });

                zavorra((doc, x, y, w, h) => {
                    field(doc, x, y, w, h, 'zavorra', dive.weights, {
                        ...fieldOptions,
                        sublabel: '(kg)'
                    }); // dive.weights
                });
                bombola((doc, x, y, w, h) => {
                    field(doc, x, y, w, h, 'bombola', tankVolume, {
                        ...fieldOptions,
                        sublabel: '(litri)'
                    });
                });

                gas((doc, x, y, w, h) => {
                    field(doc, x, y, w, h, 'gas', gas.label, {
                        ...fieldOptions,
                        sublabel: '(Aria/EANx)'
                    });
                });

                field(doc, startX, r[2], width, rowH, 'altro', null, fieldOptions);
            });

            nextY = nextY + groupHeight + 10;
        }

        // Profilo di Immersione
        {
            const groupHeight = 15;
            const [first, second] = columns(doc, [40, 60], startX, nextY, width, groupHeight, 5);
            first((doc, x, y, w, h) => {
                title(doc, 'Profilo Di Immersione', x, y);
            });
            second((doc, x, y, w, h) => {
                const [a, b, c, d] = columns(doc, [25, 25, 25, 25], x, y, w, h, 5);

                a((doc, x, y, w, h) => {
                    checkbox(doc, x, y, w, h, 'quadra');
                });
                b((doc, x, y, w, h) => {
                    checkbox(doc, x, y, w, h, 'multilivello');
                });
                c((doc, x, y, w, h) => {
                    checkbox(doc, x, y, w, h, 'tabella');
                });
                d((doc, x, y, w, h) => {
                    checkbox(doc, x, y, w, h, 'computer');
                });
            });
            nextY = nextY + groupHeight + 10;
        }

        {
            // Grafico
            {
                const top_y = nextY + 32;
                const initial_x = startX + 80;

                const bottom_y = top_y + 107;
                const bottom_x = initial_x + 10;
                const bottom_w = bottom_x + 107;

                const ds_x = bottom_w + 13;
                const ds_y = bottom_y - 44;
                const ds_w = ds_x + 18;

                const eds_x = ds_w + 13;
                const eds_y = ds_y - 55;
                const eds_w = eds_x + 24;

                const final_x = eds_w + 15;
                const final_y = top_y;
                const final_w = startX + width;

                doc.lineWidth(3)
                    .moveTo(startX, top_y)
                    .lineTo(initial_x, top_y)
                    .lineTo(bottom_x, bottom_y)
                    .lineTo(bottom_w, bottom_y)
                    .lineTo(ds_x, ds_y)
                    .lineTo(ds_w, ds_y)
                    .lineTo(eds_x, eds_y)
                    .lineTo(eds_w, eds_y)
                    .lineTo(final_x, final_y)
                    .lineTo(final_w, final_y)
                    .stroke()
                    .lineWidth(1);
            }

            const groupHeight = 142; // 5cm

            const [first, second, third, fourth] = columns(
                doc,
                [25, 36, 17, 21],
                startX,
                nextY,
                width,
                groupHeight,
                10
            );

            const { r, rowH } = rows(nextY, groupHeight, 4, 5);

            const fH = 22;
            const fieldOptions = { labelSpacing: 2, fullBorder: true, bold: true };

            const baseFW = 40;

            first((doc, x, y, w, h) => {
                fieldWithUpperLabel(doc, x, r[0], 15, rowH, 'FAR');
                fieldWithUpperLabel(
                    doc,
                    x + 15,
                    r[0],
                    50,
                    rowH,
                    'Int. di sup.',
                    dive.surfaceInterval
                );
                fieldWithUpperLabel(doc, x + 15 + 50, r[0], 15, rowH, 'FAR');

                field(doc, x, centerY(r[1], fH, rowH), 65, fH, 'Ora', time(dive.entry_time), {
                    ...fieldOptions,
                    sublabel: 'inizio'
                });

                field(
                    doc,
                    x + 15,
                    centerY(r[2], fH, rowH),
                    50,
                    fH,
                    'Bar',
                    Math.round(gas.pressureStart),
                    {
                        ...fieldOptions,
                        sublabel: 'inizio'
                    }
                );

                fieldWithUpperLabel(doc, x + 27, r[3], baseFW, rowH, 'Penalità', null, {
                    bold: true,
                    sublabel: '(min)'
                });
            });
            second((doc, x, y, w, h) => {
                fieldWithUpperLabel(doc, x + 5, r[3], baseFW, rowH, 'T fondo', dive.tempi.fondo, {
                    bold: true,
                    sublabel: '(min)'
                });
                fieldWithUpperLabel(
                    doc,
                    x + 5 + baseFW + 15,
                    r[3],
                    baseFW,
                    rowH,
                    'T tabella',
                    null,
                    {
                        bold: true,
                        sublabel: '(min)'
                    }
                );
            });
            third((doc, x, y, w, h) => {
                fieldWithUpperLabel(doc, x, r[3], baseFW, rowH, 'Prof max', dive.max_depth, {
                    bold: true,
                    sublabel: '(min)'
                });
            });
            fourth((doc, x, y, w, h) => {
                fieldWithUpperLabel(doc, x + 17, r[0], 15, rowH, 'FAR');

                field(doc, x, centerY(r[1], fH, rowH), w, fH, 'Ora', time(dive.exit_time), {
                    ...fieldOptions,
                    sublabel: 'fine'
                });

                field(
                    doc,
                    x,
                    centerY(r[2], fH, rowH),
                    w - 15,
                    fH,
                    'Bar',
                    Math.round(gas.pressureEnd),
                    {
                        ...fieldOptions,
                        sublabel: 'fine'
                    }
                );

                fieldWithUpperLabel(doc, x + 17, r[3], baseFW, rowH, 'T totale', dive.dive_time, {
                    bold: true,
                    sublabel: '(min)'
                });
            });

            nextY = nextY + groupHeight + 15;
        }

        // Annotazioni
        block(doc, startX, nextY, width, height - nextY + startY, (doc, x, y, w, h) => {
            title(doc, 'Annotazioni', x, y);
            const margin = 15;
            squares(doc, x, y + margin, w, h - margin, dive.notes);
        });
    });

    footer(doc, nextX, nextY + panelH, contentWidth, FOOTER_HEIGHT);
}

module.exports = page;
