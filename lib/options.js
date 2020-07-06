require('dotenv').config();

const hasMaps = !!process.env.MAPS_API;

if (!hasMaps) {
    console.log('No maps api key found.');
}

module.exports = {
    maps: hasMaps ? { key: process.env.MAPS_API } : null,
};
