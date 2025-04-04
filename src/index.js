// src/index.js
const config = require('../config/agent.config');
const { fetchVendorDataXML, fetchOrdersDataXML, fetchLedgerDataXML } = require('./services/tallyService');
const { syncDataToServer } = require('./services/syncService');
const { logSyncStats } = require('./utils/logger');
const { sendSyncEmail } = require('./utils/mailer');

async function runAgent() {
  console.log(`=== Starting Tally ODBC Agent in ${config.mode} mode ===`);
  try {
    // Define lastRun and currentRun timestamps.
    // For demonstration, we're using a static lastRun from config.
    // In production, store/retrieve lastRun from a file or DB.
    const lastRun = config.lastRun || '2024-04-01T00:00:00.000Z';
    const currentRun = new Date().toISOString();

    // Fetch data from Tally for each module
    const vendors = await fetchVendorDataXML(lastRun, currentRun);
   // const orders = await fetchOrdersDataXML(lastRun, currentRun);
   // const ledgers = await fetchLedgerDataXML(lastRun, currentRun);

    // Calculate counts and extract IDs for debugging/reporting
    const vendorCount = vendors.length;
    // const ordersCount = orders.length;
    // const ledgerCount = ledgers.length;
    // const vendorIDs = vendors.map(v => v.$ID || v.ID || v.$Name || 'N/A');
    // const orderIDs = orders.map(o => o.$VoucherNumber || o.VoucherNumber || 'N/A');
    // const ledgerIDs = ledgers.map(l => l.$ID || l.ID || l.$Name || 'N/A');

    // const stats = {
    //   lastRun,
    //   currentRun,
    //   vendorCount,
    //   ordersCount,
    //   ledgerCount,
    //   vendorIDs,
    //   orderIDs,
    //   ledgerIDs
    // };

    // console.log('Sync Stats:', JSON.stringify(stats, null, 2));

    // // Log sync stats locally for debugging
    // logSyncStats(stats);

    // // Prepare payload (includes fetched data and stats) for the cloud server
    // const payload = {
    //   vendors,
    //   orders,
    //   ledgers,
    //   stats
    // };

    // // Sync data to the cloud server
    // await syncDataToServer(payload);

    // // Send an email with sync statistics once the sync is complete
    // await sendSyncEmail(stats);

  } catch (error) {
    console.error('Agent execution failed:', error.message);
    process.exit(1);
  }
}



// Execute runAgent if this file is run directly
if (require.main === module) {
  runAgent();
}

module.exports = {
  runAgent
};