
// src/tallyService.js
const odbc = require('odbc');
const config = require('./config');

async function fetchDataFromTally() {
  let connection;
  try {
    // Connect to Tally using the DSN from config
    connection = await odbc.connect(config.tallyDSN);
    
    // Sample SQL query to fetch ledger data; adjust the query as needed.
    // Tally ODBC often exposes columns with a '$' prefix.
    const query = "SELECT $Name, $Email, $Address FROM Ledger";
    
    const result = await connection.query(query);
    return result;
  } catch (error) {
    console.error('Error fetching data from Tally via ODBC:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

module.exports = {
  fetchDataFromTally
};