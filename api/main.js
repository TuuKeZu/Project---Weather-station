const CONFIG = require('./config.json');

const express = require('express');
const router = require('./routers/router');
const cors = require('cors');
const http = require('http');
const https = require('https');
const fs = require('fs');

const app = express();

// Certificate
const privateKey = fs.readFileSync(CONFIG['private-key-path'], 'utf8');
const certificate = fs.readFileSync(CONFIG['certificate-path'], 'utf8');
const ca = fs.readFileSync(CONFIG['certificate-authority-path'], 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};


app.use(express.json());
app.use(cors());
app.use('/api/', router);

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(CONFIG.port, () => {
	console.log(`Listening on ${CONFIG.port}`);
});