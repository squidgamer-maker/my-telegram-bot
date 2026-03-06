const { default: makeWASocket, useMultiFileAuthState, delay, Browsers } = require('@whiskeysockets/baileys');
const pino = require('pino');

async function connect() {
    // Using a new session folder to avoid any old "stain"
    const { state, saveCreds } = await useMultiFileAuthState('session_stealth');
    
    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        // This simulates an Android device connecting, which often bypasses desktop blocks
        browser: Browsers.ubuntu('Chrome'), 
        syncFullHistory: false,
        connectTimeoutMs: 60000
    });

    if (!sock.authState.creds.registered) {
        console.log("🛠️ Attempting Mobile-to-Mobile handshake...");
        await delay(12000); // 12-second cool-off
        
        try {
            const code = await sock.requestPairingCode('254754893499');
            console.log('\n🌟 SUCCESS! CODE:', code);
        } catch (err) {
            console.log("\n❌ Status: Identity Blocked.");
            console.log("💡 Fix: You MUST change your IP. Switch to a VPN or different SIM data.");
        }
    }

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (u) => {
        if (u.connection === 'open') console.log('\n🚀 DEVICE LINKED!');
    });
}
connect();
