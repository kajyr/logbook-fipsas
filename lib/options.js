const CONF_DIR = `.logbook-templates`;
const path = require('path');
const fs = require('fs-extra');
const config = require('home-config').load(path.join(CONF_DIR, 'config'));

const fullHomeConfDir = path.resolve(path.join(process.env.HOME, CONF_DIR));
const cacheDir = path.join(fullHomeConfDir, 'cache');
fs.ensureDirSync(cacheDir);

const hasMaps = !!config.maps;
if (!hasMaps) {
    console.log('No maps api key found.');
}

module.exports = {
    maps: config.maps,
    cacheDir,
};
