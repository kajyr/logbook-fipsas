function sign({ version, isFake }) {
    const s = [isFake ? ':' : '.'];

    return `${s.join('')} ${version}`;
}

module.exports = { sign };
