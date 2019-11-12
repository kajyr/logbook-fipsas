const test = require('ava');
const enricher = require('../enrichers/type');

test('Enricher: type', t => {
    t.is(
        enricher({
            entry: '',
            tags: ['Istruttore', 'notturna'],
            gases: [{ label: 'Aria' }]
        }).type,
        'notturna'
    );

    t.is(
        enricher({
            entry: 'da barca',
            tags: ['nitrox'],
            gases: [{ label: 'EAN32' }]
        }).type,
        'EAN32, da barca'
    );
});
