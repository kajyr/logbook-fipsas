function enricher(dive) {
    const { types: scopo, ...other } = dive;

    return {
        ...other,
        scopo: scopo.join(', ')
    };
}

module.exports = enricher;
