const CONFIG = require('./config.json');

const express = require('express');
const router = require('./routers/router');

const app = express();

app.use(express.json());

app.use('/api/', router);

app.listen(CONFIG.port, () => {
console.log(`Listing on ${CONFIG.port}...`);
});