function sign({ version, isFake }) {
    const s = [isFake ? ':' : '.'];

    return `${version} ${s.join('')}`;
}

module.exports = { sign };
