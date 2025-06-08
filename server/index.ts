// ────────── Module Importing ──────────
import dotenv from 'dotenv'; dotenv.config({ path: __dirname + '/.env' });
import express from 'express';
import WebSocket from 'ws';
import https from 'https';
import dnssd from 'dnssd';
import path from 'path';
import fs from 'fs';
import { IncomingMessage } from 'http';

// ────────── Custom Modules ──────────
import { notifyClient } from './functions/utils.ts';

// ────────── Application Setup ──────────
const app = express();

const settings = {
    Port: Number(process.env.PORT) || 3000
};

// ────────── HTTPS Server Setup ──────────
const server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'assets/selfsigned.key')),
    cert: fs.readFileSync(path.join(__dirname, 'assets/selfsigned.crt'))
}, app);

// ────────── WebSocket Server Setup ──────────
const wss = new WebSocket.Server({ noServer: true });

// ────────── Middleware Configuration ──────────
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ────────── Routes ──────────
app.get('/selfsigned.crt', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/selfsigned.crt'));
});

app.get('/loadSettings', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/settings.json'));
});

app.post('/updateSettings', (req, res) => {
    const settingsPath = path.join(__dirname, 'assets/settings.json');

    fs.readFile(settingsPath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Failed to read settings');

        let settings;
        try {
            settings = JSON.parse(data);
        } catch {
            return res.status(500).send('Invalid settings JSON');
        }

        // Merge updates from req.body into settings
        Object.assign(settings, req.body);

        fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), err => {
            if (err) return res.status(500).send('Failed to save settings');

            res.json(settings);
        });
    });
});

// ────────── WebSocket Connection Handling ──────────
wss.on('connection', (ws: WebSocket) => {
    console.log('Client Connected');
    ws.on('close', () => {
        console.log('Client Disconnected');
    });
    ws.on('message', async (message: string) => {
        try {
            //function
        } catch (err) {
            notifyClient(ws, { error: 'Invalid WebSocket message format' });
            ws.close();
        }
    });
});

// ────────── WebSocket Upgrade Handling ──────────
server.on('upgrade', (request: IncomingMessage, socket, head) => {
    if (request.url === '/ws') {
        wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

// ────────── Server Startup ──────────
server.listen(settings.Port, () => {
    new dnssd.Advertisement(dnssd.tcp('https'), settings.Port, {
        name: 'MasterChiefs_Consigliere',
        host: 'MasterChiefs_Consigliere.local'
    }).start();

    console.log(`HTTPS Server running on port ${settings.Port}`);
    console.log(`Server: https://MasterChiefs_Consigliere.local:${settings.Port}`);
});