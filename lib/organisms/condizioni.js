const { columnsFixed, columns, rows } = require('../atoms/grid');
const panel = require('../atoms/panel');
const { input } = require('../atoms/input');
const { title } = require('../atoms/titles');
const label = require('../atoms/label');
const condizioniAmbientali = require('../molecules/condizioni-ambientali');

const component = (doc, x, y, w, h, dive) =>
    panel(doc, x, y, w, h, 3, (doc, x, y, w, h) => {
        // condizioni
        title(doc, 'CONDIZIONI', x, y, 9, { width: w });

        const [ambientali, personali] = columns(doc, [60, 40], x, y, w, h, 5);

        const { r, rowH } = rows(y + 10, h - 10, 4, 1);

        ambientali((doc, x, y, w, h) => {
            title(doc, 'AMBIENTALI', x, y, 6, { width: w, align: 'center' });

            condizioniAmbientali(doc, x, y, w, h, r, rowH, dive);
        });
        personali((doc, x, y, w, h) => {
            title(doc, 'PERSONALI', x, y, 6, { width: w, align: 'center' });

            const [labels, inputs] = columnsFixed(doc, [25, null], x, y, w, h, 2);

            labels((doc, x, y, w, h) => {
                label(doc, 'prima', null, x, r[0], w, rowH, 'left');
                label(doc, 'dopo', null, x, r[2], w, rowH, 'left');
            });
            inputs((doc, x, y, w, h) => {
                input(doc, x, r[0], w, rowH, null);
                input(doc, x, r[1], w, rowH, null);
                input(doc, x, r[2], w, rowH, null);
                input(doc, x, r[3], w, rowH, null);
            });
        });
    });

module.exports = component;
