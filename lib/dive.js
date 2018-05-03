const unique = list => Array.from(new Set(list));

function buddies(buddies, divemaster) {
    return unique([].concat(buddies).concat(divemaster))
        .filter(b => !!b && b.trim() !== '')
        .join(', ');
}

function half_depth_break(max_depth) {
    return max_depth > 18 ? Math.ceil(max_depth / 2) + 'm' : '___';
}

function half_depth_break_time(max_depth) {
    return max_depth > 18 ? '2.5' : '-';
}

function bottom_time(dive_time, max_depth) {
    return dive_time - 5 - Math.ceil((max_depth - 6) / 9) - (max_depth > 18 ? 2.5 : 0);
}

function surface_is_calm(surface) {
    return ['', 'nessuno', 'normale', 'calmo'].includes(surface.toLowerCase());
}
function surface_is_mid(surface) {
    return ['poco mosso', 'leggero'].includes(surface.toLowerCase());
}
function surface_is_rough(surface) {
    return ['mosso'].includes(surface.toLowerCase());
}

function emersion_time(max_depth) {
    return Math.ceil((max_depth - 6) / 9);
}

function visibility_is_enough(visibility) {
    return ['media'].includes(visibility.toLowerCase());
}
function visibility_is_good(visibility) {
    return ['', 'buona'].includes(visibility.toLowerCase());
}
function visibility_is_poor(visibility) {
    return ['scarsa'].includes(visibility.toLowerCase());
}

function weather_is_clear(weather) {
    return ['sereno', 'sole'].includes(weather.toLowerCase());
}
function weather_is_cloud(weather) {
    return ['foschia', 'nuvoloso'].includes(weather.toLowerCase());
}
function weather_is_rain(weather) {
    return ['pioggia', 'burrasca', 'neve'].includes(weather.toLowerCase());
}

function current_is_calm(current) {
    return ['', 'nessuna'].includes(current.toLowerCase());
}
function current_is_strong(current) {
    return ['TODO: find this'].includes(current.toLowerCase());
}
function current_is_weak(current) {
    return ['media'].includes(current.toLowerCase());
}

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

function water(value) {
    switch (value.toLowerCase()) {
        case 'pool':
        case 'piscina':
            return;
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

function surface_interval(isRepetitive, surfIntervalInMinutes) {
    if (!isRepetitive) {
        return '-';
    }
    const hours = Math.floor(surfIntervalInMinutes / 60);
    const minutes = surfIntervalInMinutes % 60;
    return `${hours}:${minutes}`;
}

module.exports = {
    buddies,
    bottom_time,
    half_depth_break,
    half_depth_break_time,
    surface_is_calm,
    surface_is_mid,
    surface_is_rough,
    emersion_time,
    visibility_is_enough,
    visibility_is_good,
    visibility_is_poor,
    weather_is_clear,
    weather_is_cloud,
    weather_is_rain,
    current_is_calm,
    current_is_strong,
    current_is_weak,
    entry,
    water,
    surface_interval
};
