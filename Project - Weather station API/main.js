const CONFIG = require('./config.json');

const express = require('express');
const routerGet = require('./routers/router-get');
const routerUpdate = require('./routers/router-update');

const app = express();

app.use(express.json());

app.use('/api/get', routerGet);

app.listen(CONFIG.port, () => {
console.log(`Listing on ${CONFIG.port}...`);
});