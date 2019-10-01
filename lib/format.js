/**
 * Takes a 14:13:22 string and return it formatted. 14:13
 * @param {*} str
 */
function time(str) {
    const [h, m, s] = str.split(':');
    return [h, m].join(':');
}

function timefromSeconds(sec_str) {
    let sec = parseFloat(sec_str);

    const h = Math.floor(sec / 3600);
    sec %= 3600;
    const m = Math.floor(sec / 60);

    return [h, m].join(':');
}

module.exports = {
    time,
    timefromSeconds
};
