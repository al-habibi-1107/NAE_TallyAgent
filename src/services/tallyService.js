// src/tallyService.js
//const odbc = require('odbc');
const config = require('../../config/agent.config');
const axios = require('axios');


/**
 * Helper function to build the XML request envelope.
 * @param {string} reportName - The report name to be fetched (e.g., 'Vendor List', 'Voucher Register', 'Ledger')
 * @param {string} lastRun - The start timestamp for the data range (ISO string)
 * @param {string} currentRun - The end timestamp for the data range (ISO string)
 * @returns {string} XML string to be sent to Tally.
 */
function buildXMLRequest(reportName, lastRun, currentRun) {
  return `
    <ENVELOPE>
      <HEADER>
        <TALLYREQUEST>Export Data</TALLYREQUEST>
      </HEADER>
      <BODY>
        <EXPORTDATA>
          <REQUESTDESC>
            <REPORTNAME>${reportName}</REPORTNAME>
            <STATICVARIABLES>
              <SVFROMDATE>${lastRun}</SVFROMDATE>
              <SVTODATE>${currentRun}</SVTODATE>
            </STATICVARIABLES>
          </REQUESTDESC>
        </EXPORTDATA>
      </BODY>
    </ENVELOPE>
  `;
}

/**
 * Generic function to fetch data from Tally using an XML envelope.
 * @param {string} reportName - The Tally report name to fetch.
 * @param {string} lastRun - The start timestamp for the data filter.
 * @param {string} currentRun - The end timestamp for the data filter.
 * @returns {Promise<Object>} Parsed JSON data from Tally.
 */
async function fetchDataFromTallyXML(reportName, lastRun, currentRun) {
  const xmlRequest = buildXMLRequest(reportName, lastRun, currentRun);
  try {
    const response = await axios.post(
      `http://${config.tallyHost}:${config.tallyPort}`,
      xmlRequest,
      {
        headers: {
          'Content-Type': 'text/xml'
        },
        timeout: 30000 // 30-second timeout
      }
    );
    const xmlResponse = response.data;
    const jsonResult = await xml2js.parseStringPromise(xmlResponse, { explicitArray: false });
    return jsonResult;
  } catch (error) {
    console.error(`Error fetching data for report ${reportName} from Tally:`, error.message);
    throw error;
  }
}

/**
 * Fetch vendor data updated between lastRun and currentRun.
 * Adjust the REPORTNAME as required by your Tally configuration.
 * @param {string} lastRun
 * @param {string} currentRun
 * @returns {Promise<Object>}
 */
async function fetchVendorDataXML(lastRun, currentRun) {
  // Replace 'Vendor List' with the correct report name for vendors if needed.
  return await fetchDataFromTallyXML('Vendor List', lastRun, currentRun);
}

/**
 * Fetch orders (voucher) data created/updated between lastRun and currentRun.
 * @param {string} lastRun
 * @param {string} currentRun
 * @returns {Promise<Object>}
 */
async function fetchOrdersDataXML(lastRun, currentRun) {
  // Replace 'Voucher Register' with the correct report name for orders if needed.
  return await fetchDataFromTallyXML('Voucher Register', lastRun, currentRun);
}

/**
 * Fetch ledger data created/updated between lastRun and currentRun.
 * @param {string} lastRun
 * @param {string} currentRun
 * @returns {Promise<Object>}
 */
async function fetchLedgerDataXML(lastRun, currentRun) {
  // Replace 'Ledger' with the appropriate report name if needed.
  return await fetchDataFromTallyXML('Ledger', lastRun, currentRun);
}

module.exports = {
  fetchVendorData,
  fetchOrdersData,
  fetchLedgerData
};

//------------------- ODBC (DEPRICIATED) ------------------------------//

// Existing sample function: fetchDataFromTally (for ledger data as an example)
async function fetchDataFromTally() {
  let connection;
  try {
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

// Function to fetch vendor data updated between lastRun and currentRun
async function fetchVendorData(lastRun, currentRun) {
  let connection;
  try {
    connection = await odbc.connect(config.tallyDSN);
    // Assuming a Vendor table exists with a $ModifiedDate field
    const query = "SELECT * FROM Vendor WHERE $ModifiedDate BETWEEN ? AND ?";
    const result = await connection.query(query, [lastRun, currentRun]);
    return result;
  } catch (error) {
    console.error('Error fetching vendor data from Tally via ODBC:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// Function to fetch orders data (from Voucher table) created/updated between lastRun and currentRun
async function fetchOrdersData(lastRun, currentRun) {
  let connection;
  try {
    connection = await odbc.connect(config.tallyDSN);
    // Assuming the Voucher table holds order data and uses a $ModifiedDate field
    const query = "SELECT * FROM Voucher WHERE $ModifiedDate BETWEEN ? AND ?";
    const result = await connection.query(query, [lastRun, currentRun]);
    return result;
  } catch (error) {
    console.error('Error fetching orders data from Tally via ODBC:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// Function to fetch ledger data created/updated between lastRun and currentRun
async function fetchLedgerData(lastRun, currentRun) {
  let connection;
  try {
    connection = await odbc.connect(config.tallyDSN);
    // Assuming the Ledger table has a $ModifiedDate field
    const query = "SELECT * FROM Ledger WHERE $ModifiedDate BETWEEN ? AND ?";
    const result = await connection.query(query, [lastRun, currentRun]);
    return result;
  } catch (error) {
    console.error('Error fetching ledger data from Tally via ODBC:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

module.exports = {
  fetchDataFromTallyXML,
  fetchVendorDataXML,
  fetchOrdersDataXML,
  fetchLedgerDataXML
};