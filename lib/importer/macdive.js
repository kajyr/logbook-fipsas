const parse = require('date-fns/parse');
const format = require('date-fns/format');
const addMinutes = require('date-fns/add_minutes');
const { clean } = require('../json');
const { Logbook, DiveSchema } = require('../logbook');
const Joi = require('joi');

function normalizeDive(dive) {
    const clean_dive = clean(dive);
    console.log(clean_dive.gases);
    const entrydate = parse(`${clean_dive.Divedate}:${clean_dive.Entrytime}`);
    const exitdate = addMinutes(entrydate, clean_dive.Divetime);

    const data = {
        air_used: (clean_dive.PresS - clean_dive.PresE) * clean_dive.Tanksize
    };

    const result = Joi.validate(data, DiveSchema);
    if (result.error) {
        result.error.details.forEach(detail => console.error(detail.message));
    }
    return data;
}

function importer(xml) {
    const { dives } = xml;
    const { dive } = dives;
    return new Logbook(dive.map(normalizeDive));
}

module.exports = { importer, normalizeDive };
