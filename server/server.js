import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import { apiRouter } from './src/routes.js';

const app = express();
const port = process.env.PORT || 8888;

const filePath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filePath);

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.use(apiRouter);

app.get('/*', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, '..', 'client', 'build') });
});

app.listen(port, () => {
    console.log(`venus is listening on port ${port}`);
});