const { Telegraf } = require('telegraf');

// Replace 'YOUR_BOT_TOKEN' with the token from BotFather
const bot = new Telegraf('8186698815:AAFyMCvx_bWBfCsnGrcCd49R3LjnvbJqgME');

bot.start((ctx) => ctx.reply('Welcome! I am your Node.js bot running on Termux.'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there!'));

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
