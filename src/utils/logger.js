const fs = require('fs');

// Function to log sync stats to a local file ("sync.log")
function logSyncStats(stats) {
    const logMessage = `[${new Date().toISOString()}] Sync Stats: ${JSON.stringify(stats)}\n`;
    fs.appendFileSync('sync.log', logMessage);
  }
  
module.exports={
    logSyncStats
}