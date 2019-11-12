function enricher(dive) {
    const suit = (dive.gear &&
        dive.gear.find(
            g => g.type.toLowerCase() === 'drysuit' || g.type.toLowerCase() === 'wetsuit'
        )) || { name: '' }; // TODO UGLY HACK

    const computer = (dive.gear && dive.gear.find(g => g.type.toLowerCase() === 'computer')) || {
        name: ''
    };
    return { ...dive, namedGears: { suit, computer } };
}

module.exports = enricher;
