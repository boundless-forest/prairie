# Balance Monitor Bot for Darwinia Chain

This Telegram bot monitors the balance of a specified Darwinia blockchain account and sends notifications to a Telegram user when the balance changes.

## Features

- Monitors a Darwinia blockchain account balance in real-time
- Sends Telegram notifications when balance changes are detected
- Configurable polling interval
- Detailed logging of balance changes and bot operations

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Telegram account
- Darwinia RPC endpoint (public or private)

## Setup Instructions

### 1. Telegram Bot Setup

1. Open Telegram and search for the `@BotFather` bot
2. Start a chat with BotFather and use the `/newbot` command
3. Follow the instructions to set a name and username for your bot
4. BotFather will provide a token (API key) for your new bot - save this for later
5. Start a conversation with your new bot or add it to a group where it will send messages

### 2. Get Chat ID for Notifications

To send messages to your Telegram handle (@boundless_forest), you need to get your chat ID:

1. Start a chat with `@userinfobot` on Telegram
2. This bot will respond with your chat ID
3. Save this chat ID for configuration

### 3. Project Setup

```bash
# Clone or navigate to the project
cd /path/to/prairie/balance-monitor-bot

# Install dependencies
npm install

# Configure the bot
cp .env.example .env
# Edit .env with your Telegram bot token, chat ID, and other settings
```

### 4. Configuration

Edit the `.env` file with the following details:

```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
DARWINIA_RPC_URL=https://rpc.darwinia.network
ACCOUNT_ADDRESS=0x3E8436e87Abb49efe1A958EE73fbB7A12B419aAB
POLLING_INTERVAL=60000
```

## Running the Bot

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Running as a Service (for 24/7 monitoring)

You can set up the bot as a service using PM2 or a similar process manager:

```bash
# Install PM2 globally
npm install -g pm2

# Start the bot with PM2
pm2 start npm --name "balance-monitor-bot" -- start

# Ensure PM2 starts on boot
pm2 startup
pm2 save
```

## Security Considerations

- Keep your Telegram bot token secure and never commit it to version control
- Consider using a dedicated Telegram account/bot for sensitive financial notifications
- Regularly rotate API keys if possible
- Monitor your bot's usage to ensure it's functioning correctly

## Troubleshooting

- If the bot doesn't send messages, verify your Telegram bot token and chat ID
- Ensure the Darwinia RPC endpoint is accessible and responding
- Check logs for any connection errors or timeouts
- Verify that the account address is correct and in the proper format

## License

MIT