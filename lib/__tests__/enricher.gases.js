const test = require('ava');
const enricher = require('../enrichers/gases');

test('enrichGas', t => {
    // No gases
    t.deepEqual(enricher({}).gases, [
        {
            label: 'Aria',
            pressureStart: '',
            pressureEnd: '',
            volumeStart: '',
            volumeEnd: '',
            consumo: ''
        }
    ]);

    // Air
    t.deepEqual(
        enricher({
            gases: [
                {
                    pressureStart: 207.81,
                    pressureEnd: 83.29,
                    oxygen: 21,
                    helium: 0,
                    double: false,
                    tankSize: 15,
                    volumeStart: 3117.15
                }
            ]
        }).gases,
        [
            {
                label: 'Aria',
                pressureStart: 207,
                pressureEnd: 83,
                oxygen: 21,
                helium: 0,
                double: false,
                tankSize: 15,
                volumeStart: 3117,
                volumeEnd: 1249,
                consumo: 1868
            }
        ]
    );

    // EAN 36
    t.deepEqual(
        enricher({
            gases: [
                {
                    pressureStart: 207.81,
                    pressureEnd: 83.29,
                    oxygen: 36,
                    helium: 0,
                    double: false,
                    tankSize: 15,
                    volumeStart: 3117.15
                }
            ]
        }).gases,
        [
            {
                label: 'EAN36',
                pressureStart: 207,
                pressureEnd: 83,
                oxygen: 36,
                helium: 0,
                double: false,
                tankSize: 15,
                volumeStart: 3117,
                volumeEnd: 1249,
                consumo: 1868
            }
        ]
    );
});
