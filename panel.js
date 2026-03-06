const blessed = require('blessed');
const contrib = require('blessed-contrib');
const pm2 = require('pm2');
const { exec } = require('child_process');

const screen = blessed.screen({ smartCSR: true, title: 'Bot Admin Dashboard' });
const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

// 1. Live Log Widget
const log = grid.set(0, 0, 9, 12, contrib.log, {
  fg: "green",
  label: ' Live Bot Traffic ',
  border: { type: 'line', fg: 'cyan' }
});

// 2. Control Box for Buttons
const box = grid.set(9, 0, 3, 12, blessed.box, {
  label: ' Controls ',
  border: { type: 'line', fg: 'yellow' }
});

// --- PM2 LOG INTEGRATION ---

pm2.connect((err) => {
  if (err) {
    log.log("❌ PM2 Connect Error: " + err);
    return;
  }

  log.log("🛰️ Connected to PM2 Bus. Awaiting logs...");

  // Listen for logs from 'my-telegram-bot'
  pm2.launchBus((err, bus) => {
    bus.on('log:out', (data) => {
      if (data.process.name === 'my-bot') { // Ensure name matches your pm2 name
        log.log(`[LOG]: ${data.data.trim()}`);
      }
    });

    bus.on('log:err', (data) => {
      if (data.process.name === 'my-bot') {
        log.log(`{red-fg}[ERR]: ${data.data.trim()}{/red-fg}`);
      }
    });
  });
});

// --- ADMIN BUTTONS (RE-ADDED) ---

const btnRestart = blessed.button({
  parent: box, top: 1, left: 2, width: 15, height: 1,
  content: ' [R] RESTART ', align: 'center',
  style: { bg: 'blue', focus: { bg: 'cyan' } }
});

const btnClear = blessed.button({
  parent: box, top: 1, left: 20, width: 15, height: 1,
  content: ' [C] CLEAR ', align: 'center',
  style: { bg: 'magenta', focus: { bg: 'red' } }
});

// Button Actions
const restartBot = () => exec('pm2 restart my-bot');
btnRestart.on('press', restartBot);
screen.key(['r', 'R'], restartBot);

screen.key(['q', 'C-c'], () => {
  pm2.disconnect();
  process.exit(0);
});

screen.render();
