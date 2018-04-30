const path = require('path');
const { copy } = require('./fs');

const unique = list => Array.from(new Set(list));

const strDasherize = str => str.replace(/\s+/g, '-').toLowerCase();

function signatures(data, folder, dest) {
    const fetched = Promise.all(
        unique(data.map(dive => dive.dive_master)).map(name => {
            const file = path.join(folder, `${strDasherize(name)}.png`);
            return copy(file, dest)
                .then(file => ({ name, file }))
                .catch(err => {
                    if (err.code === 'ENOENT') {
                        console.warn('Missing signature', file);
                    } else {
                        return Promise.reject(err);
                    }
                });
        })
    )
        .then(all => all.filter(f => !!f))
        .then(all =>
            all.reduce((acc, cur) => {
                acc[cur.name] = cur.file;
                return acc;
            }, {})
        );

    return fetched;
}

module.exports = signatures;
