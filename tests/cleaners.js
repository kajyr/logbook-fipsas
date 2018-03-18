import test from 'ava';
import { cleanBools } from '../lib/normalize';

test('Clean bools', t => {
    t.is(cleanBools('True'), true);
    t.is(cleanBools('False'), false);
    t.is(cleanBools('Ciao'), 'Ciao');
});
