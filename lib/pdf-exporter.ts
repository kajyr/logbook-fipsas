import * as express from 'express';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

const app = express();

const SERVER_PORT = 55443;

function listen(appa: express.Application, port: number): Promise<any> {
    return new Promise((resolve) => {
        const server = appa.listen(port, () => resolve(server));
    });
}

async function exporter(folder, dest, verbose, debug) {
    app.use(express.static(folder));
    app.get('/', (req, res) => {
        res.sendFile(path.join(folder, 'index.html'));
    });

    const server = await listen(app, SERVER_PORT);
    const serverUri = `http://localhost:${server.address().port}`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(serverUri, { waitUntil: 'networkidle2' });
    await page.pdf({ path: dest, format: 'A5', printBackground: true });

    await browser.close();

    if (!debug) {
        server.close();
    } else {
        console.log('Keeping the server open to debug:', serverUri);
        console.log(`JSON data available at ${serverUri}/logbook.json`)
    }
}

export default exporter;
