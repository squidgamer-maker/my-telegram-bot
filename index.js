const { Telegraf } = require('telegraf');
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestWaWebVersion,
    Browsers 
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

// --- CONFIGURATION ---
const BOT_TOKEN = '8186698815:AAFyMCvx_bWBfCsnGrcCd49R3LjnvbJqgME'; // Replace with your token
const OWNER_ID = '5503666506';     // Replace with your ID from @userinfobot
const bot = new Telegraf(BOT_TOKEN);
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
        browser: Browsers.windows("Chrome")
    });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (update) => {
        if (update.connection === 'close') startWhatsApp();
    });
}

// --- 2. Middleware: Logging to Owner ---
bot.use(async (ctx, next) => {
    if (ctx.message && ctx.message.text && ctx.message.text.startsWith('/')) {
        const user = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
        await bot.telegram.sendMessage(OWNER_ID, `👤 User: ${user}\n⌨️ Command: ${ctx.message.text}`);
    }
    return next();
});

// --- 3. Dynamic Command Loader ---
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
    fs.readdirSync(commandsPath).forEach((file) => {
        if (file.endsWith('.js')) {
            const command = require(path.join(commandsPath, file));
            if (typeof command === 'function') {
                command(bot);
            }
        }
    });
}

// --- 4. API & Startup ---
app.post('/api/pair', async (req, res) => {
    if (!sock) return res.status(500).send("WhatsApp not ready");
    const code = await sock.requestPairingCode(req.body.phone.replace(/[^0-9]/g, ''));
    res.json({ code });
});

app.listen(3000, () => console.log('🌐 API active on port 3000'));
startWhatsApp();
bot.launch().then(() => console.log('🚀 Telegram Bot active!'));

