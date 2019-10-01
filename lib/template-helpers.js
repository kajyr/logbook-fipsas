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

module.exports = {
    getTipo
};
