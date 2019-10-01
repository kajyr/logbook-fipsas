const header = require('../atoms/header');
const footer = require('../atoms/footer');
const buddies = require('../atoms/buddies');
const panel = require('../atoms/panel');
const { LINE_WIDTH, PANELS_SPACING } = require('../constants/ara-didattica');
const { rows, rowsFixed, columns, columnsFixed, block } = require('../atoms/grid');
const { title } = require('../atoms/titles');
const page = require('../atoms/page');
const { squares } = require('../atoms/squares');
const { debugSquare } = require('../atoms/debug');
const {
    field,
    field_date,
    fieldWithLowerSubLabel,
    fieldWithFixedInput
} = require('../molecules/field');
const quadro1 = require('../organisms/quadro1');
const condizioni = require('../organisms/condizioni');
const profilo = require('../organisms/profilo');
const { time } = require('../../format');
const { getTipo } = require('../../template-helpers');

const MARGINS = { top: 5, bottom: 15, left: 42, right: 17 };

const PAGE_2_MARGINS = {
    top: MARGINS.top,
    bottom: MARGINS.bottom,
    left: MARGINS.right,
    right: MARGINS.left
};

const fWLS = (label, value, options) => (d, x, y, w) =>
    fieldWithLowerSubLabel(d, x, y, w, label, value, options);

const gasLabel = oxygen => (oxygen === 21 ? 'Aria' : `EAN${gas.oxygen}`);

/**
 * This logbook layout assumes only one gas.
 */
function draw(doc, dive, options) {
    /* DIVE RELATED THINGS
    
    const trisalita = Math.floor(dive.max_depth / 9) + 3;
    
    const tfondo = dive.dive_time - trisalita;
    */
    const { gear, types: scopo } = dive;
    const [gas = {}] = dive.gases;
    const { tankSize } = gas;

    const gasLabel = gas.oxygen === 21 ? 'Aria' : `EAN${gas.oxygen}`;

    const tipo = getTipo(dive.entry, dive.tags, gasLabel);

    const suit = (gear &&
        gear.find(
            g => g.type.toLowerCase() === 'drysuit' || g.type.toLowerCase() === 'wetsuit'
        )) || { name: 'Umida 5mm' }; // TODO UGLY HACK
    const computer = (gear && gear.find(g => g.type.toLowerCase() === 'computer')) || {
        name: 'Aladin Pro'
    };

    const pressureStart = gas.pressureStart ? Math.floor(gas.pressureStart) : '-';
    const pressureEnd = gas.pressureEnd ? Math.floor(gas.pressureEnd) : '-';

    const volumeStart = pressureStart * tankSize;
    const volumeEnd = pressureEnd * tankSize;
    const consumo = volumeStart - volumeEnd;

    const sostaProf = dive.max_depth > 18 ? 2.5 : 0;
    const risalita = Math.ceil(dive.max_depth / 9);
    const durata = dive.bottom_time + sostaProf + risalita + 5;

    /* END DIVE RELATED THINGS */

    page(doc, MARGINS, (doc, x, contentY, contentWidth, contentHeight) => {
        doc.lineWidth(LINE_WIDTH);

        const [pHeader, pL, pQ1, pQ2, pB, pF] = rowsFixed(
            [28, 50, 92, null, 37, 15],
            contentY,
            contentHeight,
            PANELS_SPACING
        );

        header(doc, 'SCHEDA ARIA (didattica)', x, pHeader.y, contentWidth, pHeader.h);

        panel(doc, x, pL.y, contentWidth, pL.h, 2, (doc, x, y, w, h) => {
            panel(doc, x, y, w, h, 3, (doc, x, y, w, h) => {
                const { r, rowH } = rows(y, h, 3, 2);
                doc.fontSize(10);

                const spacing = 5;

                field(doc, x, r[0], 130, rowH, 'Immersione N°', dive.number, { bold: true });
                const dateX = x + 130 + spacing;
                field_date(doc, dateX, r[0], w + x - dateX, rowH, 'Data', dive.date, {
                    bold: true
                });

                const gpsW = 130;
                const locW = w - gpsW - spacing;

                field(doc, x, r[1], locW, rowH, 'Luogo', dive.location.place, {
                    labelWidth: 45,
                    bold: true
                });

                field(doc, x, r[2], locW, rowH, 'Punto', dive.location.site, {
                    labelWidth: 45,
                    bold: true
                });

                field(doc, x + w - gpsW, r[1], gpsW, rowH, 'Lat.', dive.location.lat, {
                    labelWidth: 45,
                    bold: true
                });
                field(doc, x + w - gpsW, r[2], gpsW, rowH, 'Long.', dive.location.lng, {
                    labelWidth: 45,
                    bold: true
                });
            });
        });

        quadro1(doc, x, pQ1.y, contentWidth, pQ1.h, dive);
        panel(doc, x, pQ2.y, contentWidth, pQ2.h, 2, (doc, x, y, w, h) => {
            const [q2, qScopo, qCond, qAttr, qProfilo, qRiassunto] = rowsFixed(
                [13, 21, 53, 34, null, 77],
                y,
                h,
                PANELS_SPACING
            );

            panel(doc, x, q2.y, w, q2.h, 3, (doc, x, y, w, h) => {
                title(doc, "QUADRO 2 - DESCRIZIONE DELL'IMMERSIONE", x, y, 9, { width: w });
            });
            panel(doc, x, qScopo.y, w, qScopo.h, 3, (doc, x, y, w, h) => {
                const fieldW = w / 2;
                fieldWithLowerSubLabel(doc, x, y, fieldW, 'scopo', scopo.join(', '), {
                    sublabel: '(didattica, svago, esplorazione, foto, ...)'
                });
                fieldWithLowerSubLabel(doc, x + fieldW + 10, y, fieldW - 10, 'tipo', tipo, {
                    sublabel: '(da riva, da barca, secca, notturna, relitto,...)'
                });
            });
            condizioni(doc, x, qCond.y, w, qCond.h, dive);

            panel(doc, x, qAttr.y, w, qAttr.h, 3, (doc, x, y, w, h) => {
                // attrezzatura
                title(doc, 'ATTREZZATURA', x, y, 9, { width: w });

                const [a, b, c, d, e] = columnsFixed(
                    doc,
                    [34, 68, 34, 54, null],
                    x,
                    y + 10,
                    w,
                    h - 10,
                    3
                );

                a(
                    fWLS(null, tankSize, {
                        sublabel: 'bombole(l)'
                    })
                );
                b(
                    fWLS(null, suit.name, {
                        sublabel: 'muta'
                    })
                );
                c(
                    fWLS(null, dive.weights, {
                        sublabel: 'zavorra (kg)'
                    })
                );
                d(
                    fWLS(null, computer.name, {
                        sublabel: 'tabelle / computer'
                    })
                );
                e(
                    fWLS(null, null, {
                        sublabel: 'altro'
                    })
                );
            });
            profilo(doc, x, qProfilo.y, w, qProfilo.h, dive);
            panel(doc, x, qRiassunto.y, w, qRiassunto.h, 3, (doc, x, y, w, h) => {
                // quadro riassuntivo
                const titleW = w / 2 + 20;
                title(doc, "QUADRO RIASSUNTIVO DELL'IMMERSIONE", x, y, 9, { width: titleW });
                doc.text('tempi parziali', x + titleW, y, { width: w - titleW, align: 'right' });

                const fieldsY = y + 10;
                const fieldsH = h - 10;
                const [a, b, c] = columns(doc, [null, null, null], x, fieldsY, w, fieldsH, 15);
                const { r, rowH } = rows(fieldsY, fieldsH, 5, 2);

                const inputWidth = 30;

                a((doc, x, y, w, h) => {
                    fieldWithFixedInput(
                        doc,
                        x,
                        r[0],
                        w,
                        rowH,
                        'ora inizio imm.',
                        time(dive.entry_time),
                        { inputWidth }
                    );
                    fieldWithFixedInput(doc, x, r[1], w, rowH, 'durata', durata, {
                        inputWidth,
                        sublabel: 'B+C+D+E+F'
                    });
                    fieldWithFixedInput(doc, x, r[2], w, rowH, 'press. iniz.', pressureStart, {
                        inputWidth,
                        sublabel: 'bar'
                    });
                    fieldWithFixedInput(doc, x, r[3], w, rowH, 'volume iniz.', volumeStart, {
                        inputWidth,
                        sublabel: 'l'
                    });
                    fieldWithFixedInput(doc, x, r[4], w, rowH, 'FAR iniziale', null, {
                        inputWidth
                    });
                });
                b((doc, x, y, w, h) => {
                    fieldWithFixedInput(
                        doc,
                        x,
                        r[0],
                        w,
                        rowH,
                        'ora fine imm.',
                        time(dive.exit_time),
                        {
                            inputWidth
                        }
                    );
                    fieldWithFixedInput(doc, x, r[1], w, rowH, 'prof. max.', dive.max_depth, {
                        inputWidth,
                        sublabel: 'm'
                    });
                    fieldWithFixedInput(doc, x, r[2], w, rowH, 'press. fin.', pressureEnd, {
                        inputWidth,
                        sublabel: 'bar'
                    });
                    fieldWithFixedInput(doc, x, r[3], w, rowH, 'consumo', consumo, {
                        inputWidth,
                        sublabel: 'l'
                    });
                    fieldWithFixedInput(doc, x, r[4], w, rowH, 'FAR finale', null, { inputWidth });
                });
                c((doc, x, y, w, h) => {
                    fieldWithFixedInput(doc, x, r[0], w, rowH, 'tempo di fondo', dive.bottom_time, {
                        inputWidth,
                        sublabel: 'B'
                    });
                    const sostaProfLabel =
                        dive.max_depth > 18
                            ? `sosta prof. ${Math.ceil(dive.max_depth) / 2}m`
                            : 'sosta prof.';
                    fieldWithFixedInput(
                        doc,
                        x,
                        r[1],
                        w,
                        rowH,
                        sostaProfLabel,
                        sostaProf.toString(),
                        {
                            inputWidth,
                            sublabel: 'C'
                        }
                    );
                    fieldWithFixedInput(doc, x, r[2], w, rowH, 'risalita', risalita, {
                        inputWidth,
                        sublabel: 'D'
                    });
                    fieldWithFixedInput(doc, x, r[3], w, rowH, 'deco a 6m', null, {
                        inputWidth,
                        sublabel: 'E'
                    });
                    fieldWithFixedInput(doc, x, r[4], w, rowH, 'sosta sic. + emers', 3 + 2, {
                        inputWidth,
                        sublabel: 'F'
                    });
                });
            });
        });

        buddies(doc, x, pB.y, contentWidth, pB.h, dive);

        footer(doc, x, pF.y, contentWidth, pF.h, {
            version: options.version,
            isFake: dive.tags.indexOf('fake') !== -1
        });
    });

    page(doc, PAGE_2_MARGINS, (doc, x, y, w, h) => {
        const [pHeader, pLabel, pSquares, pF] = rowsFixed([28, 30, null, 15], y, h, PANELS_SPACING);

        header(doc, 'SCHEDA ARIA (didattica)', x, pHeader.y, w, pHeader.h);

        const info = block(doc, x, pLabel.y, w, pLabel.h);

        info((doc, x, y, w, h) => {
            title(doc, 'ANNOTAZIONI', x, y, 9, { width: w });
            doc.text(
                "(compagni d'immersione, indirizzi, numeri telefonici, punti di riferimento, piantina della zona, profili della costa e dei fondali, osservazioni naturalistiche o archeologiche, ecc)",
                x,
                y + 10,
                { width: w }
            );
        });

        squares(doc, x, pSquares.y, w, pSquares.h, dive.notes);

        footer(doc, x, pF.y, w, pF.h);
    });
}

module.exports = draw;
