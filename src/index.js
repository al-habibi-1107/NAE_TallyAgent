// src/index.js
const config = require('./config');
const { fetchDataFromTally } = require('./tallyService');
const { syncDataToServer } = require('./syncService');

async function runAgent() {
  console.log(`=== Starting Tally ODBC Agent in ${config.mode} mode ===`);
  try {
    // 1. Fetch data from Tally via ODBC
    const tallyData = await fetchDataFromTally();
    console.log('Fetched data from Tally:', JSON.stringify(tallyData, null, 2));

    // 2. Transform data if needed. Here we wrap it in an object with a sync timestamp.
    const processedData = transformTallyData(tallyData);

    // 3. Sync data to the cloud server
    await syncDataToServer(processedData);
  } catch (error) {
    console.error('Agent execution failed:', error.message);
    process.exit(1);
  }
}

function transformTallyData(rawData) {
  // Example transformation: wrap the raw data with a sync timestamp.
  // Customize this function to map and filter data as required.
  return {
    ledgerData: rawData,
    syncTime: new Date().toISOString()
  };
}

// Execute runAgent if this file is run directly
if (require.main === module) {
  runAgent();
}

module.exports = {
  runAgent
};