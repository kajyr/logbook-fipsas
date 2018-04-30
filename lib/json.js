const omap = (object, fn) =>
    Object.keys(object).reduce((acc, key) => {
        acc[key] = fn(object[key]);
        return acc;
    }, {});

const cleanArray = value => {
    if (Array.isArray(value)) {
        if (value.length === 1) {
            return cleanValue(value[0]);
        }
        return value.map(cleanValue);
    }
    return value;
};
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

const cleanObj = value => (typeof value === 'object' && !Array.isArray(value) ? omap(value, cleanValue) : value);

const cleanStr = value => (typeof value === 'string' ? value.trim() : value);

const cleaners = [cleanArray, cleanObj, cleanBool, cleanFloat, cleanStr];

const cleanValue = value => cleaners.reduce((val, cleaner) => cleaner(val), value);

module.exports = { clean: cleanObj };
