const test = require('ava');
const { fillMissing, spread } = require('../grid');

test('fillMissing', t => {
    t.deepEqual(fillMissing([null, 25, 25], 100), [50, 25, 25]);

    t.deepEqual(fillMissing([null, null, 50], 100), [25, 25, 50]);

    t.deepEqual(fillMissing([null, null, null], 90), [30, 30, 30]);
});

test.only('fillMissing supports 0 heights blocks', t => {
    t.deepEqual(fillMissing([0, null, 25, 25], 100), [0, 50, 25, 25]);
});

test('spread', t => {
    t.deepEqual(spread([25, 25], 0, 100, 2), [
        [0, 25],
        [27, 25]
    ]);
});
