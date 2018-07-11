import { IDive, IDiveEnriched, ILogbook } from './logbook';

import tabelle from 'tabelle-immersione-fipsas';

function enrich(logbook: ILogbook): ILogbook {
    let prev: IDiveEnriched;
    logbook.dives = logbook.dives
        .reverse()
        .map((dive: IDive): IDiveEnriched => {
            let farIniziale = '-';
            let farFinale = '-';

            if (dive.repetitive && prev) {
                farIniziale = prev.farFinale;
            }

            const durataPenalizzata = dive.diveTime; // TODO Inserire penalità
            console.log('⚠️ Unable to calculate Penality YET');
            if (dive.isAir) {
                farFinale = tabelle.far(tabelle.TABELLA_ARIA, dive.max_depth, durataPenalizzata) || '⚠️';
            } else {
                console.log('Unable to calculate FAR for other gases');
            }
            const newDive = (prev = Object.assign({}, dive, {
                farFinale,
                farIniziale,
            }));
            return newDive;
        })
        .reverse();
    return logbook;
}

export default enrich;
