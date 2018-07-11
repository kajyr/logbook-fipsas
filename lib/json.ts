const omap = (object: object, fn: (name: any) => any): object =>
  Object.keys(object).reduce((acc, key) => {
    acc[key] = fn(object[key]);
    return acc;
  }, {});

const cleanArray = (value: any): any => {
  if (Array.isArray(value)) {
    if (value.length === 1) {
      return cleanValue(value[0]);
    }
    return value.map(cleanValue);
  }
  return value;
};

function cleanBool(value: any): any {
  if (value === 'True') {
    return true;
  }
  if (value === 'False') {
    return false;
  }
  return value;
}

const cleanFloat = (value: any): any => {
  // Skip dates
  if (
    typeof value === 'string' &&
    (value.indexOf(':') > -1 || value.indexOf('-') > -1)
  ) {
    return value;
  }
  const flo = parseFloat(value);
  if (isNaN(flo)) {
    return value;
  }
  return flo;
};

export const clean = (value: any): any =>
  typeof value === 'object' && !Array.isArray(value)
    ? omap(value, cleanValue)
    : value;

const cleanStr = (value: any): any =>
  typeof value === 'string' ? value.trim() : value;

const cleaners = [cleanArray, clean, cleanBool, cleanFloat, cleanStr];

const cleanValue = (value: any): string =>
  cleaners.reduce((val: any, cleaner: (val: any) => any) => cleaner(val), value);
