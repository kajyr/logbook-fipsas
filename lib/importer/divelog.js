const format = require('date-fns/format');
const addMinutes = require('date-fns/add_minutes');
const { clean } = require('../json');
const { Logbook } = require('../logbook');

const {
    buddies,
    bottom_time,
    half_depth_break_time,
    half_depth_break,
    surface_is_calm,
    surface_is_mid,
    surface_is_rough,
    emersion_time,
    visibility_is_enough,
    visibility_is_good,
    visibility_is_poor,
    weather_is_clear,
    weather_is_cloud,
    weather_is_rain,
    current_is_calm,
    current_is_strong,
    current_is_weak,
    entry,
    water
} = require('../dive');

function normalizeDive(dive) {
    const clean_dive = clean(dive);
    const entrydate = new Date(`${clean_dive.Divedate} ${clean_dive.Entrytime}`);
    const exitdate = addMinutes(entrydate, clean_dive.Divetime);
    const profile = clean_dive.Profile ? clean_dive.Profile.P : [];

    let surface_interval = '-';
    if (clean_dive.Rep) {
        const [hours, minutes] = clean_dive.Surfint.split(':');
        surface_interval = `${parseInt(hours, 10)}:${parseInt(minutes, 10)}`;
    }

    const data = {
        air_used: (clean_dive.PresS - clean_dive.PresE) * clean_dive.Tanksize,
        bottom_time: bottom_time(clean_dive.Divetime, clean_dive.Depth),
        buddies: buddies(clean_dive.Buddy ? clean_dive.Buddy.$.Names : '', clean_dive.Divemaster),
        city: clean_dive.City ? clean_dive.City.$.Name : '',
        computer: clean_dive.Computer,
        country: clean_dive.Country ? clean_dive.Country.$.Name : '',
        current_is_calm: current_is_calm(clean_dive.UWCurrent),
        current_is_strong: current_is_strong(clean_dive.UWCurrent),
        current_is_weak: current_is_weak(clean_dive.UWCurrent),
        current: clean_dive.UWCurrent || '',
        date: clean_dive.Divedate,
        deco_stops: clean_dive.Deco ? clean_dive.Decostops : '-',
        depths: profile.map(p => p.Depth),
        dive_master: clean_dive.Divemaster,
        dive_suit: clean_dive.Divesuit,
        dive_time: clean_dive.Divetime,
        emersion_time: emersion_time(clean_dive.Depth),
        entry_time: clean_dive.Entrytime,
        entry: entry(clean_dive.Entry),
        exit_time: format(exitdate, 'HH:mm'),
        half_depth_break_time: half_depth_break_time(clean_dive.Depth),
        half_depth_break: half_depth_break(clean_dive.Depth),
        lat: clean_dive.Place.Lat.toFixed(4),
        long: clean_dive.Place.Lon.toFixed(4),
        max_depth: clean_dive.Depth,
        number: clean_dive.Number,
        pressure_end: clean_dive.PresE,
        pressure_start: clean_dive.PresS,
        site: clean_dive.Place.$.Name,
        surface_interval,
        surface_is_calm: surface_is_calm(clean_dive.Surface),
        surface_is_mid: surface_is_mid(clean_dive.Surface),
        surface_is_rough: surface_is_rough(clean_dive.Surface),
        surface: clean_dive.Surface,
        temps: profile.map(p => p.Temp),
        times: profile.map(p => p.$.Time),
        type: clean_dive.Divetype.toLowerCase(),
        visibility_is_enough: visibility_is_enough(clean_dive.UWCurrent),
        visibility_is_good: visibility_is_good(clean_dive.UWCurrent),
        visibility_is_poor: visibility_is_poor(clean_dive.UWCurrent),
        visibility: clean_dive.UWCurrent,
        volume_start: clean_dive.PresS * clean_dive.Tanksize,
        volume_tank: clean_dive.Tanksize,
        water: water(clean_dive.Water),
        weather_is_clear: weather_is_clear(clean_dive.Weather),
        weather_is_cloud: weather_is_cloud(clean_dive.Weather),
        weather_is_rain: weather_is_rain(clean_dive.Weather),
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
