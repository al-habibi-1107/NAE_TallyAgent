
const nodemailer = require('nodemailer');
const fs = require('fs');

// Function to send an email with sync statistics using nodemailer
async function sendSyncEmail(stats) {
    // Create an SMTP transporter using configuration from .env (via config.js)
    let transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: Number(config.SMTP_PORT),
      secure: config.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS
      }
    });
  
    // Define email options, including a summary of sync stats
    const mailOptions = {
      from: config.EMAIL_FROM, // sender address
      to: config.SYNC_EMAIL_RECIPIENT, // recipient(s)
      subject: `Tally Sync Report - ${stats.currentRun}`,
      text: `Tally Sync Report:
      
  Last Run: ${stats.lastRun}
  Current Run: ${stats.currentRun}
  Vendor Count: ${stats.vendorCount}
  Order Count: ${stats.ordersCount}
  Ledger Count: ${stats.ledgerCount}
  
  Vendor IDs: ${stats.vendorIDs.join(', ')}
  Order IDs: ${stats.orderIDs.join(', ')}
  Ledger IDs: ${stats.ledgerIDs.join(', ')}
  
  Regards,
  Tally Sync Agent`
    };
  
    try {
      let info = await transporter.sendMail(mailOptions);
      console.log('Sync report email sent:', info.messageId);
    } catch (error) {
      console.error('Error sending sync email:', error.message);
      fs.appendFileSync('sync.log', `[${new Date().toISOString()}] Error sending email: ${error.message}\n`);
    }
  }

  module.exports ={
    sendSyncEmail
  }