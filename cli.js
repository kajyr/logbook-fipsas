#!/usr/bin/env node
const yargs = require("yargs");
const { convert, convertEmpty } = require("./");
const { listImporters } = require("dive-log-importer");

const argv = yargs
  .usage("$0 file.xml")
  .option("d", {
    alias: "dest",
    default: "export.pdf",
    describe: "Output file name",
    type: "string"
  })
  .option("signatures", {
    default: "./firme",
    describe: "Folder containing the signatures",
    type: "string"
  })
  .option("template", {
    default: "fipsas-didattica",
    describe: "Template name",
    type: "string",
    demandOption: true
  })
  .option("v", {
    alias: "verbose",
    default: false,
    describe: "Verbose mode",
    type: "boolean"
  })
  .option("debug", {
    default: false,
    describe: "Debug mode",
    type: "boolean"
  })
  .option("empty", {
    default: false,
    describe: "Prints an empty sheet (Does not load any xml file)",
    type: "boolean"
  })
  .option("importers", {
    default: false,
    describe: "Print the list of available importers",
    type: "boolean"
  }).argv;

const { verbose, debug, signatures, empty, dest, template } = argv;
if (empty) {
  convertEmpty(dest, {
    verbose,
    debug,
    signaturesFolder: signatures,
    template
  });
} else if (argv.importers) {
  const list = listImporters();
  console.log("Importers: ", list);
} else {
  if (argv._.length === 0) {
    yargs.showHelp();
    process.exit();
  }

  Promise.all(
    argv._.map(file =>
      convert(file, dest, {
        verbose,
        debug,
        signaturesFolder: signatures,
        template
      })
    )
  );
}
