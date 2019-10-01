const path = require("path");
const { copy } = require("./fs");

const unique = list => Array.from(new Set(list));

const strDasherize = str => str.replace(/\s+/g, "-").toLowerCase();

function signatures(logbook, options, dest) {
  const { signaturesFolder: folder, verbose } = options;
  const fetched = Promise.all(
    unique(
      logbook.dives
        .filter(dive => !!dive.dive_master)
        .map(dive => dive.dive_master)
    ).map(name => {
      const file = path.join(folder, `${strDasherize(name)}.png`);
      return copy(file, dest)
        .then(filePath => ({ name, filePath }))
        .catch(err => {
          if (err.code === "ENOENT") {
            if (verbose) {
              console.warn("Missing signature", file);
            }
          } else {
            Promise.reject(err);
          }
        });
    })
  ).then(all =>
    all
      .filter(f => !!f)
      .reduce((acc, cur) => {
        acc[cur.name] = cur.filePath;
        return acc;
      }, {})
  );

  return fetched;
}
module.exports = signatures;
