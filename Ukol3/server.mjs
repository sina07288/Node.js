import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'counter.txt');

async function readCounter() {
    try {
        const data = await fs.promises.readFile(FILE_PATH, 'utf8');
        return parseInt(data, 10);
    } catch (err) {
        await fs.promises.writeFile(FILE_PATH, '0', 'utf8');
        return 0;
    }
}

async function writeCounter(value) {
    await fs.promises.writeFile(FILE_PATH, value.toString(), 'utf8');
}

async function modifyCounter(res, operation) {
    let count = await readCounter();
    count = operation === 'increase' ? count + 1 : count - 1;
    await writeCounter(count);
    res.send('OK');
}

app.get('/increase', async (req, res) => modifyCounter(res, 'increase'));

app.get('/decrease', async (req, res) => modifyCounter(res, 'decrease'));

app.get('/read', async (req, res) => {
    const count = await readCounter();
    res.send(count.toString());
});

app.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`);
});
