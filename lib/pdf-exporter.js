const express = require('express');
const path = require('path');
const app = express();
const puppeteer = require('puppeteer');

const SERVER_PORT = 55443;

function exporter(folder, dest, verbose, debug) {
    // viewed at http://localhost:8080
    app.use(express.static(folder));
    app.get('/', function(req, res) {
        res.sendFile(path.join(folder, 'index.html'));
    });

    const server = app.listen(SERVER_PORT, async () => {
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
        } else {
            console.log('Keeping the server open to debug');
        }
    });
}

module.exports = exporter;
