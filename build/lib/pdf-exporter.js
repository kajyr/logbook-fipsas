"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const puppeteer = require("puppeteer");
const app = express();
const SERVER_PORT = 55443;
function listen(appa, port) {
    return new Promise((resolve) => {
        const server = appa.listen(port, () => resolve(server));
    });
}
async function exporter(folder, dest, verbose, debug) {
    // viewed at http://localhost:8080
    app.use(express.static(folder));
    app.get('/', (req, res) => {
        res.sendFile(path.join(folder, 'index.html'));
    });
    const server = await listen(app, SERVER_PORT);
    const serverUri = `http://localhost:${server.address().port}`;
    if (verbose) {
        console.log('Exporting server active on', serverUri);
    }
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(serverUri, { waitUntil: 'networkidle2' });
    await page.pdf({ path: dest, format: 'A5', printBackground: true });
    await browser.close();
    if (!debug) {
        server.close();
    }
    else {
        console.log('Keeping the server open to debug');
    }
}
exports.default = exporter;
