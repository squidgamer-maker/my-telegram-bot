const { default: makeWASocket, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys');
const pino = require('pino');

async function connect() {
    const { state, saveCreds } = await useMultiFileAuthState('session_ghost');
    
    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        // Bypass block: Use a standard browser string
        browser: ["Windows", "Chrome", "110.0.0"],
        syncFullHistory: false,
        qrTimeout: 0 
    });

    if (!sock.authState.creds.registered) {
        console.log("🛠️ Initializing Stealth Handshake...");
        await delay(5000); 
        try {
            const code = await sock.requestPairingCode('254754893499');
            console.log('\n🌟 PAIRING CODE:', code);
        } catch (err) {
            console.log("\n❌ Still blocked. Check your IP/Network.");
        }
    }
}
connect();
