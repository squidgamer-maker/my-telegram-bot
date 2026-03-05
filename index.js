const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// When someone types /start
bot.start((ctx) => ctx.reply('Welcome! Your bot is officially alive on Termux. 🚀'));

// A simple 'hi' response
bot.hears('hi', (ctx) => ctx.reply('Hey there! How can I help you today?'));

// Launch the bot
bot.launch().then(() => {
    console.log('✅ Telegram Bot is running...');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
