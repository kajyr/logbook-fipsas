const parse = require('date-fns/parse');
const format = require('date-fns/format');
const addMinutes = require('date-fns/add_minutes');
const { clean } = require('../json');
const { Logbook } = require('../logbook');

function normalizeDive(dive) {
    const clean_dive = clean(dive);
    const entrydate = parse(`${clean_dive.Divedate}:${clean_dive.Entrytime}`);
    const exitdate = addMinutes(entrydate, clean_dive.Divetime);
    const profile = clean_dive.Profile ? clean_dive.Profile.P : [];

    const data = {
        air_used: (clean_dive.PresS - clean_dive.PresE) * clean_dive.Tanksize,
        bottom_time:
            clean_dive.Divetime - 5 - Math.ceil((clean_dive.Depth - 6) / 9) - (clean_dive.Depth > 18 ? 2.5 : 0),
        buddies: clean_dive.Buddy ? clean_dive.Buddy.$.Names : '',
        city: clean_dive.City ? clean_dive.City.$.Name : '',
        computer: clean_dive.Computer,
        country: clean_dive.Country ? clean_dive.Country.$.Name : '',
        current_is_calm: [''].includes(clean_dive.UWCurrent.toLowerCase()),
        current_is_strong: ['TODO: find this'].includes(clean_dive.UWCurrent.toLowerCase()),
        current_is_weak: ['media'].includes(clean_dive.UWCurrent.toLowerCase()),
        current: clean_dive.UWCurrent || '',
        date: clean_dive.Divedate,
        deco_stops: clean_dive.Deco ? clean_dive.Decostops : '-',
        depths: profile.map(p => parseFloat(p.Depth)),
        dive_master: clean_dive.Divemaster,
        dive_suit: clean_dive.Divesuit,
        dive_time: clean_dive.Divetime,
        emersion_time: Math.ceil((clean_dive.Depth - 6) / 9),
        entry_time: clean_dive.Entrytime,
        entry: clean_dive.Entry,
        exit_time: format(exitdate, 'HH:mm'),
        half_depth_break_time: clean_dive.Depth > 18 ? '2.5' : '-',
        half_depth_break: clean_dive.Depth > 18 ? Math.ceil(clean_dive.Depth / 2) + 'm' : '___',
        lat: parseFloat(clean_dive.Place.Lat).toFixed(4),
        long: parseFloat(clean_dive.Place.Lon).toFixed(4),
        max_depth: clean_dive.Depth,
        number: clean_dive.Number,
        pressure_end: Math.round(clean_dive.PresS),
        pressure_start: Math.round(clean_dive.PresE),
        site: clean_dive.Place.$.Name,
        surface_interval: clean_dive.Rep ? clean_dive.Surfint : '-',
        surface_is_calm: ['nessuno', 'normale', 'calmo'].includes(clean_dive.Surface.toLowerCase()),
        surface_is_mid: ['poco mosso', 'leggero'].includes(clean_dive.Surface.toLowerCase()),
        surface_is_rough: ['mosso'].includes(clean_dive.Surface.toLowerCase()),
        surface: clean_dive.Surface,
        temps: profile.map(p => parseFloat(p.Temp)),
        times: profile.map(p => parseFloat(p.$.Time)),
        type: clean_dive.Divetype,
        visibility_is_enough: ['media'].includes(clean_dive.UWCurrent.toLowerCase()),
        visibility_is_good: [''].includes(clean_dive.UWCurrent.toLowerCase()),
        visibility_is_poor: ['TODO: find this'].includes(clean_dive.UWCurrent.toLowerCase()),
        visibility: clean_dive.UWCurrent,
        volume_start: clean_dive.PresS * clean_dive.Tanksize,
        volume_tank: clean_dive.Tanksize,
        water: clean_dive.Water,
        weather_is_clear: ['sereno', 'sole'].includes(clean_dive.Weather.toLowerCase()),
        weather_is_cloud: ['foschia', 'nuvoloso'].includes(clean_dive.Weather.toLowerCase()),
        weather_is_rain: ['pioggia', 'burrasca', 'neve'].includes(clean_dive.Weather.toLowerCase()),
        weather: clean_dive.Weather,
        weights: clean_dive.Weight
    };

    return data;
}

const normalize = DirtyLogbook => {
    const [{ Dive }] = DirtyLogbook;
    return new Logbook(Dive.map(normalizeDive));
};

function importer(xml) {
    const { Divinglog } = xml;
    const { Logbook } = Divinglog;
    return normalize(Logbook);
}

function canImport(xml) {
    return 'Divinglog' in xml;
}

module.exports = { importer, canImport, normalize, normalizeDive };
