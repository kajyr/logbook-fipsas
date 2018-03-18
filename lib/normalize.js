const parse = require('date-fns/parse');
const format = require('date-fns/format');
const addMinutes = require('date-fns/add_minutes');

const omap = (object, fn) =>
    Object.keys(object).reduce((acc, key) => {
        acc[key] = fn(object[key]);
        return acc;
    }, {});

const clean = (dive, cleaners) => omap(dive, value => cleaners.reduce((val, cleaner) => cleaner(val), value));

const cleanArray = value => (Array.isArray(value) && value.length === 1 ? value[0] : value);
const cleanBool = value => {
    if (value === 'True') {
        return true;
    }
    if (value === 'False') {
        return false;
    }
    return value;
};
const cleanFloat = value => {
    let flo = parseFloat(value);
    if (isNaN(flo)) {
        return value;
    }
    return flo;
};

const cleanStr = value => (typeof value === 'string' ? value.trim() : value);

const normalize = Logbook => {
    const [{ Dive }] = Logbook;
    return Dive.map(dive => {
        const entrydate = parse(`${dive.Divedate}:${dive.Entrytime}`);
        const diveTime = Math.round(parseFloat(dive.Divetime));
        const exitdate = addMinutes(entrydate, diveTime);
        const profile = dive.Profile[0].P;

        const clean_dive = clean(dive, [cleanArray, cleanBool, cleanFloat, cleanStr]);

        return Object.assign({}, clean_dive, clean_dive.$, {
            Depths: profile.map(p => parseFloat(p.Depth[0])),
            Temps: profile.map(p => parseFloat(p.Temp[0])),
            Times: profile.map(p => parseFloat(p.$.Time)),
            Exittime: format(exitdate, 'HH:mm'),
            Buddy: clean_dive.Buddy.$.Names,
            City: clean_dive.City.$.Name,
            Country: clean_dive.Country.$.Name,
            Place: clean_dive.Place.$.Name,
            Lat: parseFloat(clean_dive.Place.Lat[0]).toFixed(4),
            Lon: parseFloat(clean_dive.Place.Lon[0]).toFixed(4),
            $: undefined
        });
    });
};

module.exports = { cleanBool, normalize };
