const test = require('ava');
const { rows } = require('../grid');

test('rows', t => {
    const { r } = rows(0, 115, 4, 5);
    t.deepEqual(r, [0, 30, 60, 90]);

    const { r: r2 } = rows(10, 115, 4, 5);
    t.deepEqual(r2, [10, 40, 70, 100]);
});
