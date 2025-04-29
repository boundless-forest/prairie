require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { ethers } = require('ethers');
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'bot.log' })
  ]
});

// Environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const DARWINIA_RPC_URL = process.env.DARWINIA_RPC_URL || 'https://rpc.darwinia.network';
const ACCOUNT_ADDRESS = process.env.ACCOUNT_ADDRESS || '0x3E8436e87Abb49efe1A958EE73fbB7A12B419aAB';
const POLLING_INTERVAL = parseInt(process.env.POLLING_INTERVAL || '60000'); // Default: 1 minute

// Validate required configuration
if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  logger.error('Missing required environment variables: TELEGRAM_BOT_TOKEN and/or TELEGRAM_CHAT_ID');
  process.exit(1);
}

// Initialize Telegram bot
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

// Initialize Ethereum provider
let provider;
try {
  provider = new ethers.providers.JsonRpcProvider(DARWINIA_RPC_URL);
  logger.info(`Connected to Darwinia RPC at ${DARWINIA_RPC_URL}`);
} catch (error) {
  logger.error(`Failed to connect to Darwinia RPC: ${error.message}`);
  process.exit(1);
}

// Check if account address is valid
if (!ethers.utils.isAddress(ACCOUNT_ADDRESS)) {
  logger.error(`Invalid Ethereum/Darwinia address: ${ACCOUNT_ADDRESS}`);
  process.exit(1);
}

// Store the last known balance
let lastBalance = null;

/**
 * Send message to Telegram chat
 * @param {string} message - Message to send
 */
async function sendTelegramMessage(message) {
  try {
    await bot.sendMessage(TELEGRAM_CHAT_ID, message);
    logger.info(`Message sent to Telegram chat ${TELEGRAM_CHAT_ID}`);
  } catch (error) {
    logger.error(`Failed to send Telegram message: ${error.message}`);
  }
}

/**
 * Format balance in a human-readable way (converting from wei to Ether)
 * @param {ethers.BigNumber} balance - Balance in wei
 * @returns {string} Formatted balance
 */
function formatBalance(balance) {
  return `${ethers.utils.formatEther(balance)} RING`;
}

/**
 * Check account balance and compare with last known balance
 */
async function checkBalance() {
  try {
    const currentBalance = await provider.getBalance(ACCOUNT_ADDRESS);
    
    logger.info(`Current balance for ${ACCOUNT_ADDRESS}: ${formatBalance(currentBalance)}`);
    
    // If this is the first check, just store the balance
    if (lastBalance === null) {
      lastBalance = currentBalance;
      logger.info(`Initial balance recorded: ${formatBalance(currentBalance)}`);
      return;
    }
    
    // Compare with last known balance
    if (!currentBalance.eq(lastBalance)) {
      const difference = currentBalance.sub(lastBalance);
      const action = difference.gte(0) ? 'increased' : 'decreased';
      const changeAmount = ethers.utils.formatEther(difference.abs());
      
      const message = `🚨 Alert: The Darwinia account ${ACCOUNT_ADDRESS} balance has ${action} by ${changeAmount} RING\n\n` +
                     `Previous balance: ${formatBalance(lastBalance)}\n` +
                     `Current balance: ${formatBalance(currentBalance)}`;
      
      await sendTelegramMessage(message);
      
      // Update last known balance
      lastBalance = currentBalance;
    } else {
      logger.debug('No balance change detected');
    }
  } catch (error) {
    logger.error(`Error checking balance: ${error.message}`);
  }
}

// Initial balance check and notification
async function initialize() {
  try {
    await provider.getNetwork();
    logger.info('Connected to Darwinia network');
    
    const balance = await provider.getBalance(ACCOUNT_ADDRESS);
    lastBalance = balance;
    
    const startMessage = `🔄 Balance Monitor Bot started\n\n` +
                         `Monitoring account: ${ACCOUNT_ADDRESS}\n` +
                         `Current balance: ${formatBalance(balance)}\n` +
                         `Polling interval: ${POLLING_INTERVAL / 1000} seconds`;
    
    await sendTelegramMessage(startMessage);
    logger.info('Initialization complete');
  } catch (error) {
    logger.error(`Initialization failed: ${error.message}`);
    process.exit(1);
  }
}

// Start the monitoring process
async function startMonitoring() {
  await initialize();
  
  // Set up periodic balance checking
  setInterval(checkBalance, POLLING_INTERVAL);
  logger.info(`Balance checking scheduled every ${POLLING_INTERVAL / 1000} seconds`);
}

// Handle errors and graceful shutdown
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught exception: ${error.message}`);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled rejection at: ${promise}, reason: ${reason}`);
});

process.on('SIGINT', async () => {
  logger.info('Bot shutting down...');
  await sendTelegramMessage('⚠️ Balance Monitor Bot is shutting down');
  process.exit(0);
});

// Start the bot
startMonitoring().catch(error => {
  logger.error(`Failed to start monitoring: ${error.message}`);
  process.exit(1);
});