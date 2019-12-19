const composePromise = (...functions) => initialValue =>
    functions.reduceRight((sum, fn) => Promise.resolve(sum).then(fn), initialValue);

async function enrich(logbook) {
    return new Promise(resolve => {
        const enrichers = composePromise(
            require('./maps'),
            require('./gear'),
            require('./type'),
            require('./scopo'),
            require('./gases'),
            require('./tempi')
        );

        Promise.all(logbook.dives.map(enrichers)).then(dives => {
            resolve({ ...logbook, dives });
        });
    });
}

module.exports = enrich;
