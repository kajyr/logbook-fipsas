const getUrl = require('../neutrons/getUrl');
const mkHash = require('../md5');

const isEmpty = (val) => !val || val === '';

async function getMap(lat, lng, options) {
    const mapW = 900;
    const mapH = 300;
    const size = `${900}x${mapH}`;
    const zoom = '12';

    const markers = encodeURIComponent(`|${lat},${lng}|`);
    const params = [`size=${size}`, `zoom=${zoom}`, `markers=${markers}`].join('&');

    const url = `https://maps.googleapis.com/maps/api/staticmap?${params}&key=${options.maps.key}`;

    const hash = mkHash(params);

    return getUrl(url, `${hash}.png`, options);
}

function enricher(dive, options) {
    if (!options.maps) {
        return dive;
    }
    const { location } = dive;
    const { lat, lng } = location;

    if (isEmpty(lat) || isEmpty(lng)) {
        return dive;
    }

    return getMap(lat, lng, options).then((image) => {
        if (!image) {
            return dive;
        }
        return {
            ...dive,
            location: {
                ...location,
                image,
            },
        };
    });
}

module.exports = enricher;
