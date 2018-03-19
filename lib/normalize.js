const parse = require('date-fns/parse');
const format = require('date-fns/format');
const addMinutes = require('date-fns/add_minutes');
const { clean } = require('./json');

function place({ Place }) {
    if (!Place) {
        return {};
    }
    return {
        Place: Place.$.Name,
        Lat: parseFloat(Place.Lat[0]).toFixed(4),
        Lon: parseFloat(Place.Lon[0]).toFixed(4)
    };
}

function normalizeDive(dive) {
    const { $, ...clean_dive } = clean(dive);
    const entrydate = parse(`${clean_dive.Divedate}:${clean_dive.Entrytime}`);
    const exitdate = addMinutes(entrydate, clean_dive.Divetime);
    const profile = clean_dive.Profile ? clean_dive.Profile.P : [];

    return Object.assign({}, clean_dive, $, place(clean_dive), {
        Depths: profile.map(p => parseFloat(p.Depth[0])),
        Temps: profile.map(p => parseFloat(p.Temp[0])),
        Times: profile.map(p => parseFloat(p.$.Time)),
        Exittime: format(exitdate, 'HH:mm'),
        Buddy: clean_dive.Buddy ? clean_dive.Buddy.$.Names : '',
        City: clean_dive.City ? clean_dive.City.$.Name : '',
        Country: clean_dive.Country ? clean_dive.Country.$.Name : '',
        Surfint: clean_dive.Rep ? clean_dive.Surfint : '-',
        PresS: Math.round(clean_dive.PresS),
        PresE: Math.round(clean_dive.PresE),
        Consumo: (clean_dive.PresS - clean_dive.PresE) * clean_dive.Tanksize,
        TempoFondo: clean_dive.Divetime - 5 - Math.ceil((clean_dive.Depth - 6) / 9) - (clean_dive.Depth > 18 ? 2.5 : 0),
        HalfDepthBreak: clean_dive.Depth > 18 ? Math.ceil(clean_dive.Depth / 2) + 'm' : '',
        HalfDepthBreakTime: clean_dive.Depth > 18 ? '2.5' : '-',
        EmersionTime: Math.ceil((clean_dive.Depth - 6) / 9),
        Decostops: clean_dive.Deco ? clean_dive.Decostops : '-',
        TankVolInitial: clean_dive.PresS * clean_dive.Tanksize
    });
}

const normalize = Logbook => {
    const [{ Dive }] = Logbook;
    return Dive.map(normalizeDive);
};

module.exports = { normalize, normalizeDive };
