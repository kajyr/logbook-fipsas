import * as addMinutes from 'date-fns/add_minutes';
import * as format from 'date-fns/format';
import { clean } from '../json';
import { IDive, ILogbook } from '../logbook';

import {
    bottom_time,
    buddies,
    current_is_calm,
    current_is_strong,
    current_is_weak,
    emersion_time,
    entry,
    half_depth_break,
    half_depth_break_time,
    surface_is_calm,
    surface_is_mid,
    surface_is_rough,
    surfaceInterval,
    visibility_is_enough,
    visibility_is_good,
    visibility_is_poor,
    water,
    weather_is_clear,
    weather_is_cloud,
    weather_is_rain,
  } from '../dive';

function normalizeDive(dive: object): IDive  {
    const cleanDive = clean(dive);
    const diveTime = Math.floor(cleanDive.duration / 60);

    let computer = cleanDive.gear.item.find((i) => i.type === 'Computer');
    computer = computer ? computer.name : '';
    let diveSuit = cleanDive.gear.item.find((i) => i.type === 'Wetsuit');
    diveSuit = diveSuit ? diveSuit.name : '';

    const entryDate = new Date(cleanDive.date);
    const exitDate = addMinutes(entryDate, diveTime);

    const {
        gases: { gas },
        samples: { sample = [] },
    } = cleanDive;
    const repetitive = cleanDive.repetitiveDive > 1;
    const isAir = gas.oxygen === 21;
    const data = {
        air_used: (gas.pressureStart - gas.pressureEnd) * gas.tankSize,
        bottom_time: bottom_time(diveTime, cleanDive.maxDepth),
        buddies: buddies(
            typeof cleanDive.buddies === 'string' ? cleanDive.buddies : cleanDive.buddies.buddy,
            cleanDive.diveMaster,
        ),
        city: cleanDive.site.location,
        computer,
        country: cleanDive.site.country,
        current: cleanDive.current || '',
        current_is_calm: current_is_calm(cleanDive.current),
        current_is_strong: current_is_strong(cleanDive.current),
        current_is_weak: current_is_weak(cleanDive.current),
        date: format(entryDate, 'YYYY-MM-DD'),
        deco_stops: '-',
        depths: sample.map((p) => p.depth),
        diveSuit,
        diveTime,
        dive_master: cleanDive.diveMaster,
        emersion_time: emersion_time(cleanDive.maxDepth),
        entry: entry(cleanDive.entryType),
        entry_time: format(entryDate, 'HH:mm'),
        exit_time: format(exitDate, 'HH:mm'),
        half_depth_break: half_depth_break(cleanDive.maxDepth),
        half_depth_break_time: half_depth_break_time(cleanDive.maxDepth),
        isAir,
        lat: cleanDive.site.lat.toFixed(4),
        long: cleanDive.site.lon.toFixed(4),
        max_depth: cleanDive.maxDepth,
        number: cleanDive.diveNumber,
        pressure_end: gas.pressureEnd,
        pressure_start: gas.pressureStart,
        repetitive,
        site: cleanDive.site.name,
        surface: cleanDive.surfaceConditions,
        surfaceInterval: surfaceInterval(repetitive, cleanDive.surfaceInterval),
        surface_is_calm: surface_is_calm(cleanDive.surfaceConditions),
        surface_is_mid: surface_is_mid(cleanDive.surfaceConditions),
        surface_is_rough: surface_is_rough(cleanDive.surfaceConditions),
        temps: sample.map((p) => p.temperature),
        times: sample.map((p) => p.time),
        type: (cleanDive.types.type || '').toLowerCase(),
        visibility: cleanDive.visibility,
        visibility_is_enough: visibility_is_enough(cleanDive.visibility),
        visibility_is_good: visibility_is_good(cleanDive.visibility),
        visibility_is_poor: visibility_is_poor(cleanDive.visibility),
        volume_start: gas.pressureStart * gas.tankSize,
        volume_tank: gas.tankSize,
        water: water(cleanDive.site.waterType),
        weather: cleanDive.weather,
        weather_is_clear: weather_is_clear(cleanDive.weather),
        weather_is_cloud: weather_is_cloud(cleanDive.weather),
        weather_is_rain: weather_is_rain(cleanDive.weather),
        weights: cleanDive.weight,
    };
    return data;
}

function importer(xml: any): ILogbook {
    const { dives } = xml;
    const { dive } = dives;
    return {dives: dive.map(normalizeDive)};
}

module.exports = { importer, normalizeDive };
