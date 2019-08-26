/**
 *
 * @param {number} min The min value
 * @param {number} max The max value
 * @param {number} rangeMin the Y value for the top of the charting area
 * @param {number} rangeMax the Y value for the bottom of the charting area
 */
function scale(in_min, in_max, out_min, out_max) {
    return num => ((num - in_min) * (out_min - out_max)) / (in_max - in_min) + out_max;
}

module.exports = { scale };
