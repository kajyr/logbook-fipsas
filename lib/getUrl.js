/**
 * Url downloader to file module
 */
const path = require('path');
const https = require('https');
const fs = require('fs-extra');
const { getOptions } = require('./options');

async function getUrl(url, file) {
    const { verbose, cacheDir } = getOptions();
    const cached = path.join(cacheDir, file);

    return new Promise(resolve => {
        if (fs.existsSync(cached)) {
            //file exists
            if (verbose) {
                console.log(`Cached ${url}`);
            }
            return resolve(cached);
        }

        if (verbose) {
            console.log(`Downloading ${url}`);
        }
        const file = fs.createWriteStream(cached);
        https.get(url, response => {
            response.pipe(file);
            resolve(cached);
        });
    });
}

module.exports = getUrl;
