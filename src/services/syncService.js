// src/syncService.js
const axios = require('axios');
const config = require('./config');

async function syncDataToServer(data) {
  try {
    const response = await axios.post(
      config.serverEndpoint,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        timeout: 30000 // 30-second timeout
      }
    );
    console.log('Data synced successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error syncing data to server:', error.message);
    throw error;
  }
}

module.exports = {
  syncDataToServer
};