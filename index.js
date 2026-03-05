const { default: makeWASocket, useMultiFileAuthState, delay, DisconnectReason, Browsers } = require('@whiskeysockets/baileys');
const { Telegraf } = require('telegraf');
const pino = require('pino');
const readline = require('readline');
require('dotenv').config();

const question = (text) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => rl.question(text, resolve));
};

// --- UNIVERSAL COMMAND LOGIC ---
const handleCommand = async (platform, id, text, sock = null, ctx = null) => {
    if (!text) return;
    const cmd = text.toLowerCase().trim();
    const prefix = "/";
    let response = '';

    // COMMANDS LIST
    if (cmd === 'ping' || cmd === prefix + 'ping') {
        response = `🏓 *Pong!*\n- Platform: ${platform}\n- Speed: 12ms\n- Status: 🚀 Online`;
    } 
    else if (cmd === 'menu' || cmd === 'help' || cmd === prefix + 'menu') {
        response = `*🤖 HYBRID BOT MENU*\n\n*General Commands:*\n- *ping*: Check if bot is alive\n- *owner*: Show developer info\n- *repo*: Get the GitHub link\n- *status*: Show system stats\n\n_Tip: Commands work on both WA & TG!_`;
    } 
    else if (cmd === 'owner' || cmd === prefix + 'owner') {
        response = `👤 *Owner Info*\n- Name: @squidgamer-maker\n- Platform: Termux Engine v2.0`;
    } 
    else if (cmd === 'repo' || cmd === prefix + 'repo') {
        response = `📂 *GitHub Repository*\nLink: https://github.com/squidgamer-maker/my-telegram-bot\n\n_Star the repo if you like it!_`;
    } 
    else if (cmd === 'status' || cmd === prefix + 'status') {
        const runtime = process.uptime();
        response = `📊 *Bot Status*\n- Uptime: ${Math.floor(runtime / 60)} minutes\n- Node Version: ${process.version}\n- Platform: ${process.platform}`;
    }

    if (response) {
        if (platform === 'WA') {
            await sock.sendMessage(id, { text: response });
        } else {
            await ctx.replyWithMarkdown(response);
        }
    }
};

// --- TELEGRAM SETUP ---
const tgBot = new Telegraf(process.env.BOT_TOKEN);
tgBot.on('text', (ctx) => handleCommand('TG', ctx.chat.id, ctx.message.text, null, ctx));
tgBot.launch().then(() => console.log('✅ [Telegram] Online'));

// --- WHATSAPP SETUP ---
async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('session_wa');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        browser: Browsers.ubuntu('Chrome')
    });

    if (!sock.authState.creds.registered) {
        const phoneNumber = await question('\n📱 Enter WhatsApp Number (e.g. 254754893499): ');
        let codeRequested = false;
        
        sock.ev.on('connection.update', async (update) => {
            const { qr } = update;
            if (qr && !codeRequested) {
                codeRequested = true;
                console.log('⏳ Stabilizing handshake... (10s)');
                await delay(10000);
                try {
                    const code = await sock.requestPairingCode(phoneNumber.trim());
                    console.log(`\n✅ YOUR PAIRING CODE: ${code}\n`);
                } catch (e) {
                    console.log("❌ Error. Restarting...");
                    codeRequested = false;
                }
            }
        });
    }

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) connectToWhatsApp();
        } else if (connection === 'open') {
            console.log('✅ [WhatsApp] Online');
        }
    });

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        await handleCommand('WA', msg.key.remoteJid, text, sock);
    });
}

connectToWhatsApp();

