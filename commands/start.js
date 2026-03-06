const os = require('os');

module.exports = (bot) => {
    bot.start((ctx) => {
        const botName = "HYBRID V2.5"; // Replace with your actual bot name
        const owner = "Kenstuta";       // Replace with your name
        
        // Calculate RAM usage
        const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const usedRam = ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2);
        const cpuUsage = os.loadavg()[0].toFixed(2);

        const dashboard = `
╔══════════════════════════════╗
      *${botName} DASHBOARD*
╚══════════════════════════════╝

*👤 Owner:* ${owner}
*⚙️ Status:* Online 🟢
*💾 RAM:* ${usedRam}GB / ${totalRam}GB
*🖥️ CPU Load:* ${cpuUsage}%

*Commands Available:*
/pair - Link your WhatsApp
/help - View full guide
/status - System diagnostics

_Use the buttons or type commands to begin._
        `;
        
        ctx.replyWithMarkdown(dashboard);
    });
};
