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
    surface_interval,
    entry,
    water
} = require('../dive');

function normalizeDive(dive) {
    const clean_dive = clean(dive);
    const dive_time = Math.floor(clean_dive.duration / 60);

    let computer = clean_dive.gear.item.find(i => i.type === 'Computer');
    computer = computer ? computer.name : '';
    let dive_suit = clean_dive.gear.item.find(i => i.type === 'Wetsuit');
    dive_suit = dive_suit ? dive_suit.name : '';

    const entry_date = new Date(clean_dive.date);
    const exit_date = addMinutes(entry_date, dive_time);

    const {
        gases: { gas },
        samples: { sample = [] }
    } = clean_dive;
    const repetitive = clean_dive.repetitiveDive > 1;
    const isAir = gas.oxygen === 21;
    const data = {
        air_used: (gas.pressureStart - gas.pressureEnd) * gas.tankSize,
        bottom_time: bottom_time(dive_time, clean_dive.maxDepth),
        buddies: buddies(
            typeof clean_dive.buddies === 'string' ? clean_dive.buddies : clean_dive.buddies.buddy,
            clean_dive.diveMaster
        ),
        city: clean_dive.site.location,
        country: clean_dive.site.country,
        site: clean_dive.site.name,
        computer,
        current_is_calm: current_is_calm(clean_dive.current),
        current_is_strong: current_is_strong(clean_dive.current),
        current_is_weak: current_is_weak(clean_dive.current),
        current: clean_dive.current || '',
        date: format(entry_date, 'YYYY-MM-DD'),
        deco_stops: '-',
        depths: sample.map(p => p.depth),
        dive_master: clean_dive.diveMaster,
        dive_suit,
        isAir,
        dive_time,
        emersion_time: emersion_time(clean_dive.maxDepth),
        entry_time: format(entry_date, 'HH:mm'),
        entry: entry(clean_dive.entryType),
        exit_time: format(exit_date, 'HH:mm'),
        half_depth_break_time: half_depth_break_time(clean_dive.maxDepth),
        half_depth_break: half_depth_break(clean_dive.maxDepth),
        lat: clean_dive.site.lat.toFixed(4),
        long: clean_dive.site.lon.toFixed(4),
        max_depth: clean_dive.maxDepth,
        number: clean_dive.diveNumber,
        pressure_end: gas.pressureEnd,
        pressure_start: gas.pressureStart,
        repetitive,
        surface_interval: surface_interval(repetitive, clean_dive.surfaceInterval),
        surface_is_calm: surface_is_calm(clean_dive.surfaceConditions),
        surface_is_mid: surface_is_mid(clean_dive.surfaceConditions),
        surface_is_rough: surface_is_rough(clean_dive.surfaceConditions),
        surface: clean_dive.surfaceConditions,
        temps: sample.map(p => p.temperature),
        times: sample.map(p => p.time),
        type: (clean_dive.types.type || '').toLowerCase(),
        visibility_is_enough: visibility_is_enough(clean_dive.visibility),
        visibility_is_good: visibility_is_good(clean_dive.visibility),
        visibility_is_poor: visibility_is_poor(clean_dive.visibility),
        visibility: clean_dive.visibility,
        volume_start: gas.pressureStart * gas.tankSize,
        volume_tank: gas.tankSize,
        water: water(clean_dive.site.waterType),
        weather_is_clear: weather_is_clear(clean_dive.weather),
        weather_is_cloud: weather_is_cloud(clean_dive.weather),
        weather_is_rain: weather_is_rain(clean_dive.weather),
        weather: clean_dive.weather,
        weights: clean_dive.weight
    };
    return data;
}

function importer(xml) {
    const { dives } = xml;
    const { dive } = dives;
    return new Logbook(dive.map(normalizeDive));
}

module.exports = { importer, normalizeDive };
