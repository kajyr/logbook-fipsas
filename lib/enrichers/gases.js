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

function enricher(dive) {
    // gas
    const rawGases = dive.gases && dive.gases.length > 0 ? dive.gases : [{}];
    const gases = rawGases.map(enrichGas);

    return { ...dive, gases };
}

module.exports = enricher;
