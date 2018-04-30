import test from 'ava';
import { importer } from '../lib/importer';

test('Simple dive', async t => {
    const expected = {
        air_used: 2100,
        bottom_time: 31.5,
        buddies: 'Andrea',
        city: 'Porto Santo Stefano',
        computer: 'Aladin Sport Matrix',
        country: 'Italia',
        current_is_calm: true,
        current_is_strong: false,
        current_is_weak: false,
        current: '',
        date: '2017-11-11',
        deco_stops: '-',
        depths: [],
        depths: [],
        dive_master: 'Mauro',
        dive_suit: 'umida monopezzo',
        dive_time: 42,
        emersion_time: 3,
        entry_time: '09:00',
        entry: 'Boat',
        exit_time: '09:42',
        half_depth_break_time: '2.5',
        half_depth_break: '14m',
        lat: '42.4010',
        long: '11.0914',
        max_depth: 27.4,
        number: 1,
        pressure_end: 210,
        pressure_start: 70,
        site: 'Scoglio del Corallo',
        surface_interval: '-',
        surface_is_calm: true,
        surface_is_mid: false,
        surface_is_rough: false,
        surface: 'Normale',
        temps: [],
        times: [],
        type: 'Addestramento',
        visibility_is_enough: false,
        visibility_is_good: true,
        visibility_is_poor: false,
        visibility: '',
        volume_start: 3150,
        volume_tank: 15,
        water: 'Salt',
        weather_is_clear: true,
        weather_is_cloud: false,
        weather_is_rain: false,
        weather: 'sereno',
        weights: 9
    };
    return importer('./tests/divinglog/simple.xml').then(logbook => {
        const [first_dive] = logbook.dives;
        t.deepEqual(first_dive, expected);
    });
});