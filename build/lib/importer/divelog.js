"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const addMinutes = require("date-fns/add_minutes");
const format = require("date-fns/format");
const json_1 = require("../json");
const dive_1 = require("../dive");
function normalizeDive(dive) {
    const cleanDive = json_1.clean(dive);
    const entrydate = new Date(`${cleanDive.Divedate} ${cleanDive.Entrytime}`);
    const exitdate = addMinutes(entrydate, cleanDive.Divetime);
    const profile = cleanDive.Profile ? cleanDive.Profile.P : [];
    const repetitive = cleanDive.Rep;
    let surfaceInterval = '-';
    if (cleanDive.Rep) {
        const [hours, minutes] = cleanDive.Surfint.split(':');
        surfaceInterval = `${parseInt(hours, 10)}:${parseInt(minutes, 10)}`;
    }
    console.log('Warning: air model not implement');
    const isAir = true; // gas.oxygen === 21;
    const data = {
        air_used: (cleanDive.PresS - cleanDive.PresE) * cleanDive.Tanksize,
        bottom_time: dive_1.bottom_time(cleanDive.Divetime, cleanDive.Depth),
        buddies: dive_1.buddies(cleanDive.Buddy ? cleanDive.Buddy.$.Names : '', cleanDive.Divemaster),
        city: cleanDive.City ? cleanDive.City.$.Name : '',
        computer: cleanDive.Computer,
        country: cleanDive.Country ? cleanDive.Country.$.Name : '',
        current: cleanDive.UWCurrent || '',
        current_is_calm: dive_1.current_is_calm(cleanDive.UWCurrent),
        current_is_strong: dive_1.current_is_strong(cleanDive.UWCurrent),
        current_is_weak: dive_1.current_is_weak(cleanDive.UWCurrent),
        date: cleanDive.Divedate,
        deco_stops: cleanDive.Deco ? cleanDive.Decostops : '-',
        depths: profile.map((p) => p.Depth),
        diveSuit: cleanDive.Divesuit,
        diveTime: cleanDive.Divetime,
        dive_master: cleanDive.Divemaster,
        emersion_time: dive_1.emersion_time(cleanDive.Depth),
        entry: dive_1.entry(cleanDive.Entry),
        entry_time: cleanDive.Entrytime,
        exit_time: format(exitdate, 'HH:mm'),
        half_depth_break: dive_1.half_depth_break(cleanDive.Depth),
        half_depth_break_time: dive_1.half_depth_break_time(cleanDive.Depth),
        isAir,
        lat: cleanDive.Place.Lat.toFixed(4),
        long: cleanDive.Place.Lon.toFixed(4),
        max_depth: cleanDive.Depth,
        number: cleanDive.Number,
        pressure_end: cleanDive.PresE,
        pressure_start: cleanDive.PresS,
        repetitive,
        site: cleanDive.Place.$.Name,
        surface: cleanDive.Surface,
        surfaceInterval,
        surface_is_calm: dive_1.surface_is_calm(cleanDive.Surface),
        surface_is_mid: dive_1.surface_is_mid(cleanDive.Surface),
        surface_is_rough: dive_1.surface_is_rough(cleanDive.Surface),
        temps: profile.map((p) => p.Temp),
        times: profile.map((p) => p.$.Time),
        type: cleanDive.Divetype.toLowerCase(),
        visibility: cleanDive.UWCurrent,
        visibility_is_enough: dive_1.visibility_is_enough(cleanDive.UWCurrent),
        visibility_is_good: dive_1.visibility_is_good(cleanDive.UWCurrent),
        visibility_is_poor: dive_1.visibility_is_poor(cleanDive.UWCurrent),
        volume_start: cleanDive.PresS * cleanDive.Tanksize,
        volume_tank: cleanDive.Tanksize,
        water: dive_1.water(cleanDive.Water),
        weather: cleanDive.Weather,
        weather_is_clear: dive_1.weather_is_clear(cleanDive.Weather),
        weather_is_cloud: dive_1.weather_is_cloud(cleanDive.Weather),
        weather_is_rain: dive_1.weather_is_rain(cleanDive.Weather),
        weights: cleanDive.Weight,
    };
    return data;
}
exports.normalizeDive = normalizeDive;
exports.normalize = (DirtyLogbook) => {
    const [{ Dive }] = DirtyLogbook;
    return { dives: Dive.map(normalizeDive) };
};
function importer(xml) {
    const { Divinglog } = xml;
    const { Logbook } = Divinglog;
    return exports.normalize(Logbook);
}
exports.importer = importer;
function canImport(xml) {
    return 'Divinglog' in xml;
}
exports.canImport = canImport;
