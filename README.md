# 🤖 SquidGamer Hybrid Bot v2.0

A high-performance, multi-platform bot engine for **Telegram** and **WhatsApp**, designed to run 24/7 on **Termux**.

## 🚀 Key Features
- **Dual-Link**: Unified command handler for TG & WA.
- **Easy Pairing**: Connect to WhatsApp via Pairing Code (No QR needed).
- **Secure**: Sensitive data stored in `.env` and excluded from Git.
- **Persistent**: Uses `baileys` multi-file auth to stay logged in.

## 🛠 Installation
1. `git clone https://github.com/squidgamer-maker/my-telegram-bot.git`
2. `cd my-telegram-bot`
3. `npm install`
4. Create a `.env` file: `echo "BOT_TOKEN=your_token_here" > .env`

## ⌨️ Available Commands
| Command | Description |
| --- | --- |
| `menu` | Display all available commands |
| `ping` | Check bot latency and status |
| `owner` | Show developer contact info |
| `repo` | Get the source code link |
| `status` | View system and bot uptime |

## 📱 How to Link WhatsApp
1. Run `node index.js`.
2. Enter your phone number when prompted.
3. Wait 10 seconds for the Pairing Code.
4. Go to WhatsApp > Linked Devices > Link with phone number.

