import test from 'ava';
import { normalizeDive } from '../lib/normalize';

const Dive = {
    $: {
        ID: '1',
        UUID: '75BB49D1-D225-45FD-B7BC-2A3DF729E154',
        Updated: '2017-11-25T16:55:13'
    },
    Number: ['1'],
    Divedate: ['2017-11-11'],
    Entrytime: ['09:00'],
    Surfint: ['\n      '],
    Country: [
        {
            $: {
                ID: '1',
                Name: 'Italia'
            }
        }
    ],
    City: [
        {
            $: {
                ID: '2',
                Name: 'Porto Santo Stefano'
            }
        }
    ],
    Place: [
        {
            $: {
                ID: '4',
                Name: 'Scoglio del Corallo'
            },
            Lat: ['42.4010194444444'],
            Lon: ['11.0914083333333']
        }
    ],
    Divetime: ['42.00'],
    Depth: ['27.40'],
    Buddy: [
        {
            $: {
                IDs: '1',
                Names: 'Andrea (Marito di Simona)'
            }
        }
    ]
};

const DiveProfile = {
    Profile: [
        {
            P: [
                {
                    $: {
                        Time: '4'
                    },
                    Depth: ['0.06'],
                    Temp: ['19.6'],
                    Warning: ['00000'],
                    Press1: ['0.0'],
                    Press2: ['0.0'],
                    Press3: ['0.0'],
                    RBT: ['0'],
                    Heartrate: ['0']
                }
            ]
        }
    ]
};

test('Cleaned dive', t => {
    const expected = {
        Buddy: 'Andrea (Marito di Simona)',
        City: 'Porto Santo Stefano',
        Consumo: NaN,
        Country: 'Italia',
        Decostops: '-',
        Depth: 27.4,
        Depths: [],
        Divedate: '2017-11-11',
        Divetime: 42,
        EmersionTime: 3,
        Entrytime: '09:00',
        Exittime: '09:42',
        HalfDepthBreak: '14m',
        HalfDepthBreakTime: '2.5',
        ID: '1',
        Lat: '42.4010',
        Lon: '11.0914',
        Number: 1,
        Place: 'Scoglio del Corallo',
        PresE: NaN,
        PresS: NaN,
        Surfint: '-',
        TankVolInitial: NaN,
        TempoFondo: 31.5,
        Temps: [],
        Times: [],
        UUID: '75BB49D1-D225-45FD-B7BC-2A3DF729E154',
        Updated: '2017-11-25T16:55:13'
    };
    t.deepEqual(normalizeDive(Dive), expected);
});

test('Cleaned dive - profile', t => {
    const expected = {
        Buddy: '',
        City: '',
        Consumo: NaN,
        Country: '',
        Decostops: '-',
        EmersionTime: NaN,
        Exittime: 'Invalid Date',
        HalfDepthBreak: '',
        HalfDepthBreakTime: '-',
        Profile: {
            P: [
                {
                    $: {
                        Time: '4'
                    },
                    Depth: ['0.06'],
                    Temp: ['19.6'],
                    Warning: ['00000'],
                    Press1: ['0.0'],
                    Press2: ['0.0'],
                    Press3: ['0.0'],
                    RBT: ['0'],
                    Heartrate: ['0']
                }
            ]
        },
        PresE: NaN,
        PresS: NaN,
        Surfint: '-',
        TankVolInitial: NaN,
        TempoFondo: NaN,
        Depths: [0.06],
        Temps: [19.6],
        Times: [4]
    };
    t.deepEqual(normalizeDive(DiveProfile).Profile.P[0], expected.Profile.P[0]);
});
