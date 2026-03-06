const { Telegraf } = require('telegraf');
const bot = new Telegraf('8186698815:AAFyMCvx_bWBfCsnGrcCd49R3LjnvbJqgME');

// Manually require the utility file and pass the bot instance
const utilityCommands = require('./commands/utility');
utilityCommands(bot);

bot.launch().then(() => console.log('Bot is live with all commands loaded!'));
