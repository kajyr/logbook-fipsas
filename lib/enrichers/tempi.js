function enricher(dive) {
    const { bottom_time: fondo } = dive;

    const isEmpty = !dive.max_depth;

    const sostaProfValue = dive.max_depth > 18 ? 2.5 : 0;
    const risalita = Math.ceil(dive.max_depth / 9);
    const tempi = isEmpty
        ? { sostaProf: { label: 'sosta prof.' } }
        : {
              sostaProf: {
                  label:
                      dive.max_depth > 18
                          ? `sosta prof. ${Math.ceil(dive.max_depth) / 2}m`
                          : 'sosta prof.',
                  value: sostaProfValue.toString() // can be 0
              },
              fondo,
              risalita,
              durata: fondo + sostaProfValue + risalita + 5
          };

    return { ...dive, tempi };
}

module.exports = enricher;
