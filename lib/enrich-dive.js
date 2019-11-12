const gear = require('./enrichers/gear');
const type = require('./enrichers/type');

const compose = (...fns) => (...args) =>
    fns
        .slice(0, fns.length - 1)
        .reduceRight((result, fn) => fn(result), fns[fns.length - 1](...args));

function enrichGas(gas) {
    if (!('pressureStart' in gas)) {
        return {
            label: 'Aria',
            pressureStart: '',
            pressureEnd: '',
            volumeStart: '',
            volumeEnd: '',
            consumo: ''
        };
    }

    const pressureStart = Math.floor(gas.pressureStart);
    const pressureEnd = Math.floor(gas.pressureEnd);
    const volumeStart = Math.floor(gas.pressureStart * gas.tankSize);
    const volumeEnd = Math.floor(gas.pressureEnd * gas.tankSize);

    return {
        ...gas,
        label: gas.oxygen !== 21 ? `EAN${gas.oxygen}` : 'Aria',
        pressureStart,
        pressureEnd,
        volumeStart,
        volumeEnd,
        consumo: volumeStart - volumeEnd
    };
}
function enrichDive(dive) {
    const { types: scopo, bottom_time: fondo, ...other } = dive;

    // gas
    const rawGases = dive.gases && dive.gases.length > 0 ? dive.gases : [{}];
    const gases = rawGases.map(enrichGas);

    // Altro
    const isEmpty = !dive.max_depth;

    const sostaProfValue = dive.max_depth > 18 ? 2.5 : 0;
    const risalita = Math.ceil(dive.max_depth / 9);
    const tempi = isEmpty
        ? { sostaProf: { label: 'sosta prof.' } }
        : {
              sostaProf: {
                  label:
                      dive.max_depth > 18
                          ? `sosta prof. ${Math.ceil(dive.max_depth) / 2}m`
                          : 'sosta prof.',
                  value: sostaProfValue.toString() // can be 0
              },
              fondo,
              risalita,
              durata: fondo + sostaProfValue + risalita + 5
          };

    return {
        ...other,
        gases,
        scopo: scopo.join(', '),
        tempi
    };
}

function enrich(logbook) {
    const enrichers = compose(gear, type, enrichDive);
    return { ...logbook, dives: logbook.dives.map(enrichers) };
}

module.exports = { enrich, enrichGas };
