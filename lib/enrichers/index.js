const compose = (...fns) => (...args) =>
    fns
        .slice(0, fns.length - 1)
        .reduceRight((result, fn) => fn(result), fns[fns.length - 1](...args));

function enrich(logbook) {
    const enrichers = compose(
        require('./gear'),
        require('./type'),
        require('./scopo'),
        require('./gases'),
        require('./tempi')
    );
    return { ...logbook, dives: logbook.dives.map(enrichers) };
}

module.exports = enrich;
