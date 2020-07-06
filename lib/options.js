const config = require('home-config').load('.logbook-templates/config');

const hasMaps = !!config.maps;

if (!hasMaps) {
    console.log('No maps api key found.');
}

module.exports = {
    maps: config.maps,
};
