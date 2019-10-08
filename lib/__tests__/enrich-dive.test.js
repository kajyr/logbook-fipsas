const test = require('ava');
const { enrichGas } = require('../enrich-dive');

test('enrichGas', t => {
    t.deepEqual(enrichGas({}), {
        label: 'Aria',
        pressureStart: '',
        pressureEnd: '',
        volumeStart: '',
        volumeEnd: '',
        consumo: ''
    });

    // Air
    t.deepEqual(
        enrichGas({
            pressureStart: 207.81,
            pressureEnd: 83.29,
            oxygen: 21,
            helium: 0,
            double: false,
            tankSize: 15,
            volumeStart: 3117.15
        }),
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
    );

    // EAN 36
    t.deepEqual(
        enrichGas({
            pressureStart: 207.81,
            pressureEnd: 83.29,
            oxygen: 36,
            helium: 0,
            double: false,
            tankSize: 15,
            volumeStart: 3117.15
        }),
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
    );
});
