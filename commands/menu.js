module.exports = (bot) => {
    // 1. The Menu UI
    bot.command('help', (ctx) => {
        const menu = `
┌─「 🎯 ᴠᴏɪᴅ xᴅ ᴍᴇɴᴜ 」

🌙 ɢᴏᴏᴅ ᴇᴠᴇɴɪɴɢ, ${ctx.from.first_name}!

ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ ᴠᴏɪᴅ xᴅ - ʏᴏᴜʀ ғᴀsᴛᴇsᴛ
ᴡʜᴀᴛsᴀᴘᴘ ᴘᴀɪʀɪɴɢ sᴏʟᴜᴛɪᴏɴ! ✨

━━━━━━━━━━━━━━━
├─「 ⚡ ǫᴜɪᴄᴋ ᴄᴏᴍᴍᴀɴᴅs 」
├─❏ /connect - ᴘᴀɪʀ ᴅᴇᴠɪᴄᴇ
├─❏ /delpair - ʀᴇᴍᴏᴠᴇ ᴘᴀɪʀ
├─❏ /runtime - ᴄʜᴇᴄᴋ ᴜᴘᴛɪᴍᴇ
├─❏ /ping - ᴄʜᴇᴄᴋ sᴘᴇᴇᴅ
├─❏ /tutorial - ғᴜʟʟ ɢᴜɪᴅᴇ
├─❏ /report - ʀᴇᴘᴏʀᴛ ɪssᴜᴇ
└─❏ /help - sʜᴏᴡ ᴀʟʟ
━━━━━━━━━━━━━━━
࿋ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ⟆ ɴᴀᴍᴇʟᴇss ᴛᴇᴄʜ ⟅𓂀 》`;
        ctx.reply(menu);
    });

    // 2. WhatsApp Pairing Logic (Placeholders)
    bot.command('connect', (ctx) => ctx.reply('🔗 Initiating WhatsApp pairing... Please scan the QR code (Example logic).'));
    bot.command('delpair', (ctx) => ctx.reply('🗑 Device connection cleared successfully.'));
    bot.command('runtime', (ctx) => ctx.reply('⏳ Bot has been running for 2 hours, 15 minutes.'));
    bot.command('tutorial', (ctx) => ctx.reply('📖 Read the full guide here: [Link to your guide]'));
    bot.command('report', (ctx) => ctx.reply('📢 Please send your report to the admin.'));
};
