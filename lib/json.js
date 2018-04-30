const omap = (object, fn) =>
    Object.keys(object).reduce((acc, key) => {
        acc[key] = fn(object[key]);
        return acc;
    }, {});

const clean = (dive, cleaners) => omap(dive, value => cleaners.reduce((val, cleaner) => cleaner(val), value));

const cleanArray = value => (Array.isArray(value) && value.length === 1 ? value[0] : value);
const cleanBool = value => {
    if (value === 'True') {
        return true;
    }
    if (value === 'False') {
        return false;
    }
    return value;
};
const cleanFloat = value => {
    // Skip dates
    if (typeof value === 'string' && (value.indexOf(':') > -1 || value.indexOf('-') > -1)) {
        return value;
    }
    let flo = parseFloat(value);
    if (isNaN(flo)) {
        return value;
    }
    return flo;
};

//const cleanObj = value => (typeof value === 'object' ? cleaner(value) : value);

const cleanStr = value => (typeof value === 'string' ? value.trim() : value);

const cleaner = object => clean(object, [cleanArray, cleanBool, cleanFloat, cleanStr]);

module.exports = { clean: cleaner };
