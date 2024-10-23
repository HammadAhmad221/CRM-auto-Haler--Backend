const express = require('express');
const Imap = require('imap');
const router = express.Router();

const invoiceSubjectRegex = /^Your\sInvoice\sis\screated\sby\sID#[0-9]+$/;

router.get('/count', (req, res) => {
  const imap = new Imap({
    user: 'dpointlogistics@gmail.com',
    password: process.env.GMAIL_PASS,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false,
    },
    connTimeout: 30000,
    authTimeout: 30000,
  });

  imap.once('ready', () => {
    imap.openBox('[Gmail]/Sent Mail', true, (err, box) => {
      if (err) {
        console.error('Error opening inbox:', err);
        return res.status(500).json({ message: 'Error opening inbox', error: err });
      }
      imap.search(['ALL'], (err, results) => {
        if (err) {
          console.error('Error searching inbox:', err);
          return res.status(500).json({ message: 'Error searching inbox', error: err });
        }

        if (!results.length) {
          console.log('No emails found');
          return res.status(200).json({ totalEmails: 0 });
        }

        const f = imap.fetch(results, { bodies: '' });
        let emailCount = 0; // Initialize email count

        f.on('message', (msg) => {
          msg.on('body', (stream) => {
            let buffer = '';
            stream.on('data', (chunk) => {
              buffer += chunk.toString('utf8');
            });
            stream.on('end', () => {
              const parsedEmail = Imap.parseHeader(buffer);
              const subject = parsedEmail.subject ? parsedEmail.subject[0] : '';
              // Check if subject matches the invoice regex
              if (invoiceSubjectRegex.test(subject)) {
                emailCount++; // Increment count for matching emails
              }
            });
          });
        });

        f.on('end', () => {
          imap.end();
          // Return the total count of matching emails
          return res.status(200).json({ totalEmails: emailCount });
        });

        f.on('error', (err) => {
          console.error('Error fetching emails:', err);
          imap.end();
          return res.status(500).json({ message: 'Error fetching emails', error: err });
        });
      });
    });
  });

  imap.connect();
});

module.exports = router;
