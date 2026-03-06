module.exports = (bot) => {
    // Utility: Helper for checking context
    const isAdmin = async (ctx) => {
        const member = await ctx.telegram.getChatMember(ctx.chat.id, ctx.from.id);
        return ['creator', 'administrator'].includes(member.status);
    };

    // --- GENERAL UTILITY ---
    bot.command('ping', async (ctx) => {
        const start = Date.now();
        const msg = await ctx.reply('🏓 Pinging...');
        const latency = Date.now() - start;
        ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, `🏓 Pong! (${latency}ms)`);
    });

    bot.command('id', (ctx) => {
        ctx.reply(`🆔 **Info**\nUser: ${ctx.from.id}\nChat: ${ctx.chat.id}\nType: ${ctx.chat.type}`);
    });

    // --- MODERATION (Group Only) ---
    bot.command('kick', async (ctx) => {
        if (ctx.chat.type === 'private') return ctx.reply('⚠️ This is a group-only command.');
        if (!(await isAdmin(ctx))) return ctx.reply('🚫 You must be an admin to use this.');
        ctx.reply(`👢 Kicked user: ${ctx.message.reply_to_message?.from.first_name || 'Target'}`);
    });

    bot.command('pin', async (ctx) => {
        if (ctx.chat.type === 'private') return ctx.reply('⚠️ Groups only.');
        if (!(await isAdmin(ctx))) return ctx.reply('🚫 Admin only.');
        ctx.pinChatMessage(ctx.message.message_id);
    });

    // --- FUN/INTERACTIVE ---
    bot.command('dice', (ctx) => ctx.replyWithDice());
    bot.command('poll', (ctx) => {
        ctx.replyWithPoll('Choose your favorite:', ['Option 1', 'Option 2', 'Option 3']);
    });

    // --- HELP MENU ---
    bot.command('help_util', (ctx) => {
        const menu = `🛠 **Command Center**
/ping - Check latency
/id - Show IDs
/kick - Kick user (Admin/Group)
/pin - Pin message (Admin/Group)
/dice - Roll a die
/poll - Create a poll`;
        ctx.reply(menu);
    });
};
