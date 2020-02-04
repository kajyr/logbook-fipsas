const getUrl = require('../getUrl');
const mkHash = require('../md5');

async function getMap(location) {
    const { lat, lng } = location;

    if (lat === '' || lng === '') {
        return Promise.resolve();
    }

    const mapW = 900;
    const mapH = 300;
    const size = `${900}x${mapH}`;
    const zoom = '12';

    const markers = encodeURIComponent(`|${lat},${lng}|`);
    const params = [`size=${size}`, `zoom=${zoom}`, `markers=${markers}`].join('&');

    const url = `https://maps.googleapis.com/maps/api/staticmap?${params}&key=${process.env.MAPS_API}`;

    const hash = mkHash(params);

    return getUrl(url, `${hash}.png`);
}

function enricher(dive) {
    return new Promise(resolve => {
        const { location, ...other } = dive;

        if (!location) {
            return dive;
        }

        getMap(location).then(image => {
            if (!image) {
                resolve(dive);
            }
            resolve({
                ...other,
                location: {
                    ...location,
                    image
                }
            });
        });
    });
}

module.exports = enricher;
