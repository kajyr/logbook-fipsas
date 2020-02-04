function fillMissing(list, total) {
    // 0 is not null, dont' want to count it
    const nulls = list.filter(v => v == null);
    // the space already taken
    const taken = list.reduce((acc, cur) => (!!cur ? acc + cur : acc), 0);

    const remaining = total - taken;

    if (remaining < 0) {
        throw new Error('There is not enough space available');
    }

    const spread = remaining / nulls.length;

    return list.map(v => (v != null ? v : spread));
}

function spread(list, start, end, gutter) {
    const available = end - gutter * (list.length - 1);

    const rows = fillMissing(list, available);
    let cur = start;
    return rows.map(value => {
        const r = [cur, value];
        cur = cur + value + gutter;
        return r;
    });
}

module.exports = { fillMissing, spread };
