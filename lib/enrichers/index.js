const composePromise = (...functions) => (initialValue, ...args) =>
    functions.reduceRight(
        (sum, fn) => Promise.resolve(sum).then((val) => fn(val, ...args)),
        initialValue
    );

const enrichers = composePromise(
    require('./maps'),
    require('./gear'),
    require('./type'),
    require('./scopo'),
    require('./gases'),
    require('./tempi')
);

async function enrich(logbook, options) {
    return Promise.all(logbook.dives.map((dive) => enrichers(dive, options))).then((dives) => {
        return { ...logbook, dives };
    });
}

module.exports = enrich;
