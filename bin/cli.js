#!/usr/bin/env node
const argv = require('yargs').argv
const convert = require('../')

console.log(argv._)

Promise.all(argv._.map(file => convert(file))).then(() => console.log('done'))
