const crypto = require('crypto');

function mkHash(str) {
    return crypto
        .createHash('md5')
        .update(str)
        .digest('hex');
}

module.exports = mkHash;
