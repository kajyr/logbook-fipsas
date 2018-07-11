const tabelle = require('tabelle-immersione-fipsas');

function enrich(logbook) {
    let prev;
    logbook.dives = logbook.dives
        .reverse()
        .map(dive => {
            let far_iniziale = '-';
            let far_finale = '-';

            if (dive.repetitive && prev) {
                far_iniziale = prev.far_finale;
            }

            const durataPenalizzata = dive.dive_time; // TODO Inserire penalità
            console.log('⚠️ Unable to calculate Penality YET');
            if (dive.isAir) {
                far_finale = tabelle.far(tabelle.TABELLA_ARIA, dive.max_depth, durataPenalizzata) || '⚠️';
            } else {
                console.log('Unable to calculate FAR for other gases');
            }
            const newDive = (prev = Object.assign({}, dive, {
                far_finale,
                far_iniziale
            }));
            return newDive;
        })
        .reverse();
    return logbook;
}

module.exports = enrich;
