const axios = require('axios'); // Ensure you have axios installed: npm install axios

module.exports = (bot) => {
    bot.command('pair', async (ctx) => {
        try {
            // Replace with your actual deployed Vercel URL
            const apiUrl = 'https://YOUR-VERCEL-URL.vercel.app/api/pair';
            
            // Send request to your Express API to get the pairing code
            const response = await axios.post(apiUrl, {
                phone: ctx.from.id // Using the user's ID as a reference
            });

            const code = response.data.code;

            ctx.reply(`*🔗 WhatsApp Pairing Code Generated*

Your code is: \`${code}\`

*Steps to pair:*
1. Open WhatsApp on your phone.
2. Go to Linked Devices.
3. Tap "Link a device" then "Link with phone number instead".
4. Enter the code above.

_Note: This code expires in 2 minutes._`);
        } catch (error) {
            ctx.reply('❌ Error: Could not generate pairing code. Ensure the bot engine is running!');
            console.error(error);
        }
    });
};

