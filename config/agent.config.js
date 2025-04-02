require('dotenv').config(); // Load .env file

const config = {
  tallyHost: process.env.TALLY_HOST || 'localhost',
  tallyPort: process.env.TALLY_PORT || 9000,
  // DSN for Tally ODBC connection
  tallyDSN: process.env.TALLY_DSN || 'DSN=TallyODBC64',
  serverEndpoint: process.env.SERVER_ENDPOINT,
  apiKey: process.env.API_KEY,
  mode: process.env.MODE || 'production'  // e.g., 'test' or 'production'
};

module.exports = config;