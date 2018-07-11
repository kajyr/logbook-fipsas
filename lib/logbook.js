const Joi = require('joi');

const DiveSchema = Joi.object().keys({
    air_used: Joi.number().required(),
    bottom_time: Joi.number().required(),
    buddies: Joi.string().required(),
    city: Joi.string().required(),
    computer: Joi.string().required(),
    country: Joi.string().required(),
    current_is_calm: Joi.boolean().required(),
    current_is_strong: Joi.boolean().required(),
    current_is_weak: Joi.boolean().required(),
    current: Joi.string().empty(''),
    date: Joi.string().required(),
    deco_stops: Joi.string().required(),
    depths: Joi.array().required(),
    dive_master: Joi.string().required(),
    dive_suit: Joi.string().empty(''),
    dive_time: Joi.number().required(),
    emersion_time: Joi.number().required(),
    entry_time: Joi.string().required(),
    entry: Joi.string().empty(''),
    exit_time: Joi.string().required(),
    exit_time: Joi.string().required(),
    half_depth_break_time: Joi.string().required(),
    half_depth_break: Joi.string().required(),
    isAir: Joi.boolean().required(),
    lat: Joi.string().required(),
    long: Joi.string().required(),
    max_depth: Joi.number().required(),
    number: Joi.number().required(),
    pressure_end: Joi.number().required(),
    pressure_start: Joi.number().required(),
    repetitive: Joi.boolean().required(),
    site: Joi.string().required(),
    surface_interval: [Joi.string().required(), Joi.number().required()],
    surface_is_calm: Joi.boolean().required(),
    surface_is_mid: Joi.boolean().required(),
    surface_is_rough: Joi.boolean().required(),
    surface: Joi.string().empty(''),
    temps: Joi.array().required(),
    times: Joi.array().required(),
    type: Joi.string().empty(''),
    visibility_is_enough: Joi.boolean().required(),
    visibility_is_good: Joi.boolean().required(),
    visibility_is_poor: Joi.boolean().required(),
    visibility: Joi.string().empty(''),
    volume_start: Joi.number().required(),
    volume_tank: Joi.number().required(),
    water: Joi.string().empty(''),
    weather_is_clear: Joi.boolean().required(),
    weather_is_cloud: Joi.boolean().required(),
    weather_is_rain: Joi.boolean().required(),
    weather: Joi.string().empty(''),
    weights: Joi.number().required()
});

class Logbook {
    constructor(dives) {
        this.dives = dives;
    }
}

const LogbookSchema = Joi.object().keys({
    dives: Joi.array().items(DiveSchema)
});

module.exports = { Logbook, LogbookSchema, DiveSchema };
