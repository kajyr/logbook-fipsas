"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unique = (list) => Array.from(new Set(list));
function buddies(buddy, divemaster) {
    const buddyList = typeof buddy === 'string' ? [buddy] : buddy;
    return unique(buddyList.concat(divemaster))
        .filter((b) => !!b && b.trim() !== '')
        .join(', ');
}
exports.buddies = buddies;
function half_depth_break(maxDepth) {
    return maxDepth > 18 ? Math.ceil(maxDepth / 2) + 'm' : '___';
}
exports.half_depth_break = half_depth_break;
function half_depth_break_time(maxDepth) {
    return maxDepth > 18 ? '2.5' : '-';
}
exports.half_depth_break_time = half_depth_break_time;
function bottom_time(diveTime, maxDepth) {
    return (diveTime - 5 - Math.ceil((maxDepth - 6) / 9) - (maxDepth > 18 ? 2.5 : 0));
}
exports.bottom_time = bottom_time;
function surface_is_calm(surface) {
    return ['', 'nessuno', 'normale', 'calmo'].includes(surface.toLowerCase());
}
exports.surface_is_calm = surface_is_calm;
function surface_is_mid(surface) {
    return ['poco mosso', 'leggero'].includes(surface.toLowerCase());
}
exports.surface_is_mid = surface_is_mid;
function surface_is_rough(surface) {
    return ['mosso'].includes(surface.toLowerCase());
}
exports.surface_is_rough = surface_is_rough;
function emersion_time(maxDepth) {
    return Math.ceil((maxDepth - 6) / 9);
}
exports.emersion_time = emersion_time;
function visibility_is_enough(visibility) {
    return ['media'].includes(visibility.toLowerCase());
}
exports.visibility_is_enough = visibility_is_enough;
function visibility_is_good(visibility) {
    return ['', 'buona'].includes(visibility.toLowerCase());
}
exports.visibility_is_good = visibility_is_good;
function visibility_is_poor(visibility) {
    return ['scarsa'].includes(visibility.toLowerCase());
}
exports.visibility_is_poor = visibility_is_poor;
function weather_is_clear(weather) {
    return ['sereno', 'sole'].includes(weather.toLowerCase());
}
exports.weather_is_clear = weather_is_clear;
function weather_is_cloud(weather) {
    return ['foschia', 'nuvoloso'].includes(weather.toLowerCase());
}
exports.weather_is_cloud = weather_is_cloud;
function weather_is_rain(weather) {
    return ['pioggia', 'burrasca', 'neve'].includes(weather.toLowerCase());
}
exports.weather_is_rain = weather_is_rain;
function current_is_calm(current) {
    return ['', 'nessuna'].includes(current.toLowerCase());
}
exports.current_is_calm = current_is_calm;
function current_is_strong(current) {
    return ['TODO: find this'].includes(current.toLowerCase());
}
exports.current_is_strong = current_is_strong;
function current_is_weak(current) {
    return ['media'].includes(current.toLowerCase());
}
exports.current_is_weak = current_is_weak;
function entry(value) {
    switch (value.toLowerCase()) {
        case 'barca':
        case 'boat':
        case '':
            return 'da barca';
        case 'riva':
            return 'da riva';
        case 'pool':
        case 'piscina':
            return 'piscina';
        default:
            return value;
    }
}
exports.entry = entry;
function water(value) {
    switch (value.toLowerCase()) {
        case 'pool':
        case 'piscina':
            return '';
        case 'fresh water':
            return 'acqua dolce';
        case 'salt':
        case 'salt water':
        case '':
            return 'mare';
        default:
            return value;
    }
}
exports.water = water;
function lpad(str, pad, length) {
    while (str.length < length) {
        str = pad + str;
    }
    return str;
}
exports.lpad = lpad;
function surfaceInterval(isRepetitive, surfIntervalInMinutes) {
    if (!isRepetitive) {
        return '-';
    }
    const hours = Math.floor(surfIntervalInMinutes / 60);
    const minutes = surfIntervalInMinutes % 60;
    return `${hours}:${lpad(minutes.toString(), '0', 2)}`;
}
exports.surfaceInterval = surfaceInterval;
