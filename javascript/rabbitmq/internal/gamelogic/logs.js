const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const sleep = promisify(setTimeout);

const logsFile = path.join(__dirname, "game.log");
const writeToDiskSleep = 1000; // 1 second in milliseconds

async function writeLog(gameLog) {
  console.log("Received game log...");
  await sleep(writeToDiskSleep);

  try {
    const str = `${new Date(gameLog.currentTime).toISOString()} ${
      gameLog.username
    }: ${gameLog.message}\n`;

    // Open the file in append mode, create it if it doesn't exist, and set the permissions to 0644
    await fs.promises.appendFile(logsFile, str, { mode: 0o644 });
  } catch (err) {
    console.error(`Could not write to logs file: ${err}`);
    throw err;
  }
}

module.exports = writeLog;
