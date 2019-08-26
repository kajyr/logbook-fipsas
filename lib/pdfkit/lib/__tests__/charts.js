const test = require('ava');
const { scale } = require('../charts');

test('scale', t => {
    // 5 is in the middle between 0 and 10
    const s = scale(0, 10, 0, 100);
    t.is(s(5), 50);

    // now 10 is the max value should be 0 because we count with (0,0) in top left corner
    t.is(s(10), 0);
    t.is(s(0), 100);

    // some 3/4 value
    t.is(s(7), 30);
});
