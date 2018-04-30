import test from 'ava';
const { buddies } = require('../lib/dive');

test('Buddies', t => {
    t.is(buddies(['Luca', 'Sonia'], 'Sonia'), 'Luca, Sonia');
    t.is(buddies('Sonia', 'Sonia'), 'Sonia');
});
