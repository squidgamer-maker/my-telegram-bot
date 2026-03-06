const { Telegraf } = require('telegraf');
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    delay, 
    fetchLatestWaWebVersion,
    Browsers 
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

const bot = new Telegraf('8186698815:AAFyMCvx_bWBfCsnGrcCd49R3LjnvbJqgME');
const app = express();
app.use(express.json());
app.use(cors());

let sock;

// --- 1. WhatsApp Engine ---
async function startWhatsApp() {
    console.log("🚀 Initializing WhatsApp Service...");
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info_whatsapp');
    const { version } = await fetchLatestWaWebVersion();
    
    sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        version,
        browser: Browsers.windows("Chrome"),
        defaultQueryTimeoutMs: undefined
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startWhatsApp();
        } else if (connection === 'open') {
            console.log('✅ WhatsApp Linked Successfully!');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (msg.message?.viewOnceMessageV2 || msg.message?.viewOnceMessageV2Extension) {
            console.log("📩 View Once message detected!");
        }
    });
}

// --- 2. Pairing API Endpoint ---
app.post('/api/pair', async (req, res) => {
    const { phone } = req.body;
    if (!sock) return res.status(500).send("WhatsApp not initialized");
    try {
        const code = await sock.requestPairingCode(phone.replace(/[^0-9]/g, ''));
        res.json({ code });
    } catch (err) {
        res.status(500).send("Pairing request failed");
    }
});

// --- 3. Telegram Modules ---
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
    fs.readdirSync(commandsPath).forEach((file) => {
        if (file.endsWith('.js')) {
            require(path.join(commandsPath, file))(bot);
            console.log(`✅ Loaded Telegram module: ${file}`);
        }
    });
}

// --- 4. Startup ---
app.listen(3000, () => console.log('🌐 Pairing API active on port 3000'));
startWhatsApp();
bot.launch().then(() => console.log('🚀 Telegram Bot active!'));

