#!/usr/bin/env node
const argv = require('yargs').argv
const convert = require('../')


convert().then(() => console.log('done'))