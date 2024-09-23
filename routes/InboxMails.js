const express = require('express');
const Imap = require('imap');
const router = express.Router();

// Configure your email and password
const email = 'dpointlogistics@gmail.com';
// const password = 'nauq uhcs nvdr kazz'; 
const password = 'hjrx jmxw twgi trnv';
//Email Subject Check
const invoiceSubjectRegex = /^Invoice #[a-z0-9]+ Created$/i;

router.get('/emails', (req, res) => {
  const imap = new Imap({
    user: email,
    password: password,
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
        const limitedResults = results.slice(-50);
        const f = imap.fetch(limitedResults, { bodies: '' });
        const emails = [];

        f.on('message', (msg) => {
          msg.on('body', (stream) => {
            let buffer = '';
            stream.on('data', (chunk) => {
              buffer += chunk.toString('utf8');
            });
            stream.on('end', () => {
              const parsedEmail = Imap.parseHeader(buffer);
              // console.log('Parsed email:', parsedEmail);
              const subject = parsedEmail.subject ? parsedEmail.subject[0] : '';

              // Test if the subject matches the regex for "Invoice #<ID> Created"
              if (invoiceSubjectRegex.test(subject)){
                emails.push(parsedEmail)
                emails.sort((a, b) => {
                  const dateA = new Date(a.date[0]); // Convert to Date object
                  const dateB = new Date(b.date[0]); // Convert to Date object
                  return dateB - dateA; // Sort in descending order
                });
              }
            });
          });
        });

        f.on('end', () => {
          // console.log('All emails fetched:', emails); 
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
