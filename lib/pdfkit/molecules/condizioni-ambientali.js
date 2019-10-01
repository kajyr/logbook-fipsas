const { columns } = require('../atoms/grid');

const label = require('../atoms/label');
const { checkbox } = require('../molecules/field');

const VISIBILITY_POOR = 'POOR';
const VISIBILITY_MEDIUM = 'MEDIUM';
const VISIBILITY_GOOD = 'GOOD';

const WEATHER_POOR = 'RAIN';
const WEATHER_MEDIUM = 'CLOUD';
const WEATHER_GOOD = 'CLEAR';

const SURFACE_ROUGH = 'ROUGH';
const SURFACE_WEAK = 'WEAK ';
const SURFACE_FLAT = 'FLAT';

const CURRENT_STRONG = 'STRONG';
const CURRENT_WEAK = 'WEAK ';
const CURRENT_NONE = 'NONE';

const component = (doc, x, y, w, h, r, rowH, dive) => {
    const [labels, ok, med, nope] = columns(doc, [null, 25, 25, 25], x, y, w, h, 1);

    labels((doc, x, y, w, h) => {
        label(doc, 'meteo:', null, x, r[0], w, rowH, 'left');
        label(doc, 'mare:', null, x, r[1], w, rowH, 'left');
        label(doc, 'visibilità:', null, x, r[2], w, rowH, 'left');
        label(doc, 'corrente:', null, x, r[3], w, rowH, 'left');
    });

    ok((doc, x, y, w) => {
        checkbox(doc, x, r[0], w, rowH, 'sereno', dive.weather_normalized === WEATHER_GOOD);
        checkbox(doc, x, r[1], w, rowH, 'calmo', dive.surface_normalized === SURFACE_FLAT);
        checkbox(doc, x, r[2], w, rowH, 'buona', dive.visibility_normalized === VISIBILITY_GOOD);
        checkbox(doc, x, r[3], w, rowH, 'assente', dive.current_normalized === CURRENT_NONE);
    });
    med((doc, x, y, w) => {
        checkbox(doc, x, r[0], w, rowH, 'coperto', dive.weather_normalized === WEATHER_MEDIUM);
        checkbox(doc, x, r[1], w, rowH, 'p. mosso', dive.surface_normalized === SURFACE_WEAK);
        checkbox(
            doc,
            x,
            r[2],
            w,
            rowH,
            'sufficiente',
            dive.visibility_normalized === VISIBILITY_MEDIUM
        );
        checkbox(doc, x, r[3], w, rowH, 'debole', dive.current_normalized === CURRENT_WEAK);
    });
    nope((doc, x, y, w) => {
        checkbox(doc, x, r[0], w, rowH, 'pioggia', dive.weather_normalized === WEATHER_POOR);
        checkbox(doc, x, r[1], w, rowH, 'mosso', dive.surface_normalized === SURFACE_ROUGH);
        checkbox(doc, x, r[2], w, rowH, 'scarsa', dive.visibility_normalized === VISIBILITY_POOR);
        checkbox(doc, x, r[3], w, rowH, 'forte', dive.current_normalized === CURRENT_STRONG);
    });
};

module.exports = component;
