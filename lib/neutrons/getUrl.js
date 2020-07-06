/**
 * Url downloader to file module
 */
const path = require('path');
const https = require('https');
const fs = require('fs-extra');
const ora = require('ora');

async function getUrl(url, output) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(output);
        https.get(url, (response) => {
            response
                .pipe(file)
                .on('finish', () => {
                    resolve(output);
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
    });
}

async function getUrlCached(url, destination, options) {
    const { verbose, cacheDir } = options;
    const cached = path.join(cacheDir, destination);
    let spinner;
    if (verbose) {
        spinner = ora(`Downloading ${url}`).start();
    }
    if (fs.existsSync(cached)) {
        //file exists
        if (verbose) {
            spinner.succeed(`Cached ${cached}`);
        }
        return Promise.resolve(cached);
    }

    return getUrl(url, cached)
        .then((result) => {
            if (spinner) {
                spinner.succeed();
            }
            return result;
        })
        .catch(() => {
            if (spinner) {
                spinner.fail();
            }
        });
}

module.exports = getUrlCached;
