const fs = require('fs');
const path = require('path');

// Function to log sync stats to a local file ("sync.log")
function logSyncStats(stats) {
    const logMessage = `[${new Date().toISOString()}] Sync Stats: ${JSON.stringify(stats)}\n`;
    fs.appendFileSync('sync.log', logMessage);
  }

function logWrite(val){
  const logFilePath = path.join(__dirname, 'logs.txt');
  const logMessage = `[${timestamp}] ${val}\n`;
 console.log(logFilePath);
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.log('Failed to write log:', err);
        } else {
            console.log('Log written successfully.');
        }
    });
}
  
module.exports={
    logSyncStats,
    logWrite
}