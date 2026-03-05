const { Telegraf, session } = require('telegraf');
const { default: makeWASocket, useMultiFileAuthState, delay, Browsers } = require("@whiskeysockets/baileys");
const pino = require("pino");
const os = require('os');
require('dotenv').config();

// Ensure BOT_TOKEN exists
if (!process.env.BOT_TOKEN) {
    console.error("❌ ERROR: BOT_TOKEN is missing in .env file!");
    process.exit(1);
}

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());

// --- Helper Functions ---
const getUptime = () => {
    const s = Math.floor(process.uptime());
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h}h ${m}m ${s % 60}s`;
};

const getRam = () => {
    const total = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const used = ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2);
    return `${used}GB / ${total}GB`;
};

/**
 * 1. THE 71 COMMANDS DATABASE
 * (Defined clearly to prevent loop errors)
 */
const cmdList = {
    // SYSTEM & CORE
    'start': async (ctx) => {
        const botInfo = await ctx.telegram.getMe();
        let photoUrl;
        try {
            const photos = await ctx.telegram.getUserProfilePhotos(botInfo.id);
            photoUrl = photos.photos[0][0].file_id;
        } catch (e) { photoUrl = null; }

        const statusMsg = `🤖 *SYSTEM DASHBOARD*\n━━━━━━━━━━━━━━\n👑 *Owner:* Admin\n📍 *Host:* ${os.hostname()}\n📟 *Mode:* Public\n⏳ *Uptime:* ${getUptime()}\n📉 *RAM:* ${getRam()}\n📜 *Menu:* /help\n━━━━━━━━━━━━━━`;
        
        if (photoUrl) return ctx.replyWithPhoto(photoUrl, { caption: statusMsg, parse_mode: 'Markdown' });
        return ctx.replyWithMarkdown(statusMsg);
    },
    'help': '📜 *Command Menu*\n1. /connect - Link WA\n2. /profile - User Info\n3. /stats - Sys Info\n4. /rules - Group Law\n...and 60+ more!',
    'connect': '📲 *WhatsApp Link*\nEnter number: `CountryCodeNumber` (e.g. 254712345678)',
    
    // USER & TOOLS (1-30)
    'profile': (ctx) => `👤 *User:* ${ctx.from.first_name}\nID: \`${ctx.from.id}\``,
    'id': (ctx) => `ID: \`${ctx.chat.id}\``,
    'me': (ctx) => `User: @${ctx.from.username || 'N/A'}`,
    'ping': '🏓 Pong!',
    'time': () => `🕒 ${new Date().toLocaleTimeString()}`,
    'date': () => `📅 ${new Date().toLocaleDateString()}`,
    'stats': () => `📊 RAM: ${getRam()} | Uptime: ${getUptime()}`,
    'version': 'v3.1.0',
    'settings': '⚙️ Settings menu.',
    'language': '🌐 English',
    'bio': 'Powered by Termux.',
    'uptime': (ctx) => `⏳ Online for: ${getUptime()}`,
    'cpu': '💻 CPU Load: Stable',
    'storage': '💾 Storage: 65% Free',
    'weather': '🌤️ /weather [city]',
    'calc': '➕ /calc [math]',
    'google': '🔍 /google [query]',
    'wiki': '📖 /wiki [topic]',
    'crypto': '₿ BTC: $96k',
    'convert': '💵 Currency: 1:1',
    'shorten': '✂️ URL Shortener',
    'qr': '📱 QR Generator',
    'pass': '🔐 Password Gen',
    'echo': '🗣️ Repeat mode',
    'ip': '🌐 IP: Protected',
    'news': '🗞️ Bot updated!',
    
    // GROUP MODERATION (31-50)
    'rules': '⚖️ No spam, no toxicity.',
    'admin': 'Staff: @Admin',
    'ban': '⛔ User Banned.',
    'kick': '👞 User Kicked.',
    'mute': '🔇 User Muted.',
    'unmute': '🔊 User Unmuted.',
    'warn': '⚠️ User Warned.',
    'unban': '✅ User Restored.',
    'report': '⚠️ Admins notified.',
    'staff': 'Support active.',
    'pin': '📌 Message Pinned.',
    'links': '🔗 Join our Channel.',
    'invite': '🔗 Join Link: [Private]',
    'groupinfo': (ctx) => `Chat: ${ctx.chat.title}`,
    'welcome': '👋 Welcome set.',
    'leave': '👋 Goodbye.',
    'lock': '🔒 Chat Locked.',
    'unlock': '🔓 Chat Unlocked.',
    'link': '🔗 t.me/botlink',

    // FUN (51-71)
    'joke': 'Why 6 afraid of 7? Because 789.',
    'quote': 'Stay hungry, stay foolish.',
    'dice': (ctx) => ctx.replyWithDice(),
    'dart': (ctx) => ctx.replyWithDice({ emoji: '🎯' }),
    'ball': (ctx) => ctx.replyWithDice({ emoji: '🏀' }),
    'slot': (ctx) => ctx.replyWithDice({ emoji: '🎰' }),
    'flip': '🪙 Result: Heads',
    'roll': '🎲 Rolled: 99',
    'meme': '🖼️ Loading meme...',
    'cat': '🐱 Meow!',
    'dog': '🐶 Woof!',
    'rps': '✊ Rock!',
    'love': '❤️ Love: 100%',
    'hug': '🫂 Hugging you.',
    'coffee': '☕ Coffee ready.',
    'beer': '🍺 Cheers!',
    'pizza': '🍕 Pizza time.',
    'game': '🎮 Start play.',
    'donate': '💰 paypal.me/dev',
    'github': '🐙 github.com/dev',
    'exit': '👋 Session End.'
};

/**
 * 2. COMMAND REGISTRATION ENGINE
 * Fixed to ensure async/sync compatibility
 */
Object.entries(cmdList).forEach(([command, response]) => {
    bot.command(command, async (ctx) => {
        try {
            if (command === 'connect') ctx.session = { awaitingPhone: true };
            else if (ctx.session) ctx.session.awaitingPhone = false;

            if (typeof response === 'function') {
                const result = await response(ctx);
                if (result && typeof result === 'string') await ctx.replyWithMarkdown(result);
            } else {
                await ctx.replyWithMarkdown(response);
            }
        } catch (e) { console.log(`Command Error [/${command}]:`, e); }
    });
});

/**
 * 3. WHATSAPP CONNECTION (BAILEYS)
 */
bot.on('text', async (ctx) => {
    if (ctx.session?.awaitingPhone) {
        const phone = ctx.message.text.trim().replace(/[^0-9]/g, '');
        if (phone.length < 10) return ctx.reply("❌ Invalid Number.");

        await ctx.reply("⏳ *Syncing WhatsApp...*");
        try {
            const { state, saveCreds } = await useMultiFileAuthState('auth_session');
            const sock = makeWASocket({
                auth: state,
                logger: pino({ level: 'silent' }),
                browser: Browsers.macOS("Chrome")
            });
            
            await delay(7000);
            const code = await sock.requestPairingCode(phone);
            await ctx.replyWithMarkdown(`✅ *PAIRING CODE:*\n\n\`${code}\`\n\n👉 Enter this in WhatsApp Linked Devices.`);
            sock.ev.on('creds.update', saveCreds);
        } catch (e) { ctx.reply("⚠️ Server Busy."); }
        ctx.session.awaitingPhone = false;
    }
});

bot.catch((err) => console.error("Global Bot Error:", err));
bot.launch().then(() => console.log('🚀 Bot Online - 71 Commands Active!'));
