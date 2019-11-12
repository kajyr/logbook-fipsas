const genMap = gasLabel => tag => {
    switch (tag.toLowerCase()) {
        case 'istruttore':
        case 'fake':
            return null;
        case 'nitrox':
            return gasLabel;
        default:
            return tag;
    }
};

function getTipo(entry, tags, gasLabel) {
    const tipo = [...tags, entry.toLowerCase()];

    return tipo
        .map(genMap(gasLabel))
        .filter(Boolean)
        .join(', ');
}
function enricher(dive) {
    const { gases } = dive;
    // Per calcolare il tipo per ora supportiamo solo il primo gas
    const [gas] = gases;

    const type = getTipo(dive.entry, dive.tags, gas.label);

    return { ...dive, type };
}

module.exports = enricher;
