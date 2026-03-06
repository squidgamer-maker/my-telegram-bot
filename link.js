const { default: makeWASocket, useMultiFileAuthState, delay, Browsers } = require('@whiskeysockets/baileys');
const pino = require('pino');

async function connect() {
    const { state, saveCreds } = await useMultiFileAuthState('session_wa');
    
    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'fatal' }),
        // Forced Desktop signature to bypass mobile verification blocks
        browser: Browsers.macOS('Desktop'),
        syncFullHistory: false,
        connectTimeoutMs: 60000
    });

    if (!sock.authState.creds.registered) {
        console.log("🛠️ Starting Secure Handshake...");
        await delay(10000); 
        
        try {
            const code = await sock.requestPairingCode('254754893499');
            console.log('\n🌟 YOUR PAIRING CODE IS:', code);
            console.log('⚠️ TYPE IT INTO WHATSAPP NOW!\n');
        } catch (err) {
            console.log("❌ Blocked by WhatsApp. Switching Network...");
            process.exit(1);
        }
    }

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (u) => {
        if (u.connection === 'open') {
            console.log('\n🚀 SUCCESS: LINKED!');
            process.exit(0);
        }
    });
}
connect();
