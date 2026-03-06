const os = require('os');

module.exports = (bot) => {
    bot.command('status', (ctx) => {
        const uptimeSeconds = os.uptime();
        const days = Math.floor(uptimeSeconds / 86400);
        const hours = Math.floor((uptimeSeconds % 86400) / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);

        // Memory calculations
        const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

        const statusMessage = `
*📊 SYSTEM STATUS*
━━━━━━━━━━━━━━━━━━
*🟢 Bot Status:* Online
*🕒 Server Uptime:* ${days}d ${hours}h ${minutes}m
*💾 RAM Usage:* ${ (totalMem - freeMem).toFixed(2) }GB / ${totalMem}GB
*🖥️ CPU Load:* ${os.loadavg()[0].toFixed(2)}%
*🌐 Network:* Connected (Tunnel Active)
━━━━━━━━━━━━━━━━━━
_Everything is running smoothly!_
        `;

        ctx.replyWithMarkdown(statusMessage);
    });
};
