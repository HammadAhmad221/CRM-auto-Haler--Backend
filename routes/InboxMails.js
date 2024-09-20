const express = require('express');
const Imap = require('imap');

const router = express.Router();

// Configure your email and password
const email = 'hammadchahal123@gmail.com';
const password = 'nauq uhcs nvdr kazz'; // Use app password if you're using Gmail

router.get('/emails', (req, res) => {
  const imap = new Imap({
    user: email,
    password: password,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false, // Ignore self-signed certificate errors
    },
  });

  imap.once('ready', () => {
    imap.openBox('INBOX', true, (err, box) => {
      if (err) {
        console.error('Error opening inbox:', err);
        return res.status(500).json({ message: 'Error opening inbox', error: err });
      }

      // Limit to the last 10 emails
      imap.search(['ALL'], (err, results) => {
        if (err) {
          console.error('Error searching inbox:', err);
          return res.status(500).json({ message: 'Error searching inbox', error: err });
        }

        if (!results.length) {
          console.log('No emails found');
          return res.status(200).json({ message: 'No emails found' });
        }

        // Limit to the last 10 emails
        const limitedResults = results.slice(-21);
        const f = imap.fetch(limitedResults, { bodies: '' });
        const emails = [];

        f.on('message', (msg, seqno) => {
          msg.on('body', (stream) => {
            let buffer = '';
            stream.on('data', (chunk) => {
              buffer += chunk.toString('utf8');
            });
            stream.on('end', () => {
              const parsedEmail = Imap.parseHeader(buffer);
              console.log('Parsed email:', parsedEmail); // Log the parsed email
              emails.push(parsedEmail);
            });
          });
        });

        f.on('end', () => {
          console.log('All emails fetched:', emails); // Log all fetched emails
          imap.end();
          return res.status(200).json(emails.length ? emails : { message: 'No emails found' });
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
