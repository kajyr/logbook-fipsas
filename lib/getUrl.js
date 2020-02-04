/**
 * Url downloader to file module
 */
const path = require('path');
const https = require('https');
const fs = require('fs-extra');
const ora = require('ora');

const options = require('./options');

async function getUrl(url, file) {
    const { verbose, cacheDir } = options;
    const cached = path.join(cacheDir, file);

    return new Promise((resolve, reject) => {
        let spinner;

        if (verbose) {
            spinner = ora(`Downloading ${url}`).start();
        }
        if (fs.existsSync(cached)) {
            //file exists
            if (verbose) {
                spinner.succeed(`Cached ${url}`);
            }
            return resolve(cached);
        }

        const file = fs.createWriteStream(cached);
        https.get(url, response => {
            response
                .pipe(file)
                .on('finish', () => {
                    if (verbose) {
                        spinner.succeed();
                    }
                    resolve(cached);
                })
                .on('error', error => {
                    if (verbose) {
                        spinner.fail();
                    }
                    reject(error);
                });
        });
    });
}

module.exports = getUrl;
