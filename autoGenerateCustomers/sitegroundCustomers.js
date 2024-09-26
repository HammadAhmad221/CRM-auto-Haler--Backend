// // emailFetcher.js
// const imaps = require('imap-simple');
// const customer = require('../models/Customer');



// // Email configuration
// const config = {
//   imap: {
//     user: 'info@blacklinetransportation.us',
//     password: 'Bigboss12!',
//     host: 'gtxm1192.siteground.biz',
//     port: 993,
//     tls: true,
//     authTimeout: 3000,
//   },
// };

// // Function to fetch emails and save leads
// const fetchEmailsAndSaveLeads = async () => {
//   try {
//     const connection = await imaps.connect(config);
//     await connection.openBox('INBOX');

//     const searchCriteria = ['UNSEEN'];
//     const fetchOptions = {
//       bodies: ['HEADER', 'TEXT'],
//       markSeen: true,
//     };

//     const messages = await connection.search(searchCriteria, fetchOptions);

//     if (messages.length === 0) {
//       console.log('No new emails.');
//       return;
//     }

//     for (const message of messages) {
//       const headerPart = message.parts.find(part => part.which === 'HEADER');
//       const bodyPart = message.parts.find(part => part.which === 'TEXT');

//       if (headerPart && bodyPart) {
//         const emailBody = bodyPart.body;

//         // Extract Name, Email Address, and Phone using regular expressions
//         const nameMatch = emailBody.match(/Name:\s*(.*)/);
//         const emailMatch = emailBody.match(/Email Address:\s*(.*)/);
//         const phoneMatch = emailBody.match(/Phone:\s*(.*)/);

//         const name = nameMatch ? nameMatch[1].trim() : null;
//         const email = emailMatch ? emailMatch[1].trim() : null;
//         const phone = phoneMatch ? phoneMatch[1].trim() : null;

//         if (name && email && phone) {
//           // Save to database
//           const newCustomer = new customer({ name, email, phone });
//           await newCustomer.save();
//           console.log(`New lead saved: Name: ${name}, Email: ${email}, Phone: ${phone}`);
//         }
//       }
//     }

//     // Close the connection
//     connection.end();
//   } catch (error) {
//     console.error('Error fetching emails:', error);
//   }
// };

// // Export the functions for use in app.js
// module.exports = fetchEmailsAndSaveLeads ;


const imaps = require('imap-simple');
const customer = require('../models/Customer');
const vehicle = require('../models/Vehicle');

const config = {
  imap: {
    user: 'info@blacklinetransportation.us',
    password: 'Bigboss12!',
    host: 'gtxm1192.siteground.biz',
    port: 993,
    tls: true,
    authTimeout: 6000,
  },
};

const fetchEmailsAndSaveLeads =()=>{  
     imaps.connect(config).then(async (connection) => {
  try {
    await connection.openBox('INBOX');

    const searchCriteria = ['UNSEEN'];
    const fetchOptions = {
      bodies: ['HEADER', 'TEXT'],
      markSeen: true,
    };

    const messages = await connection.search(searchCriteria, fetchOptions);

    if (messages.length === 0) {
      console.log('No new emails.');
      return;
    }

    messages.forEach(async(message) => {
      const headerPart = message.parts.find(part => part.which === 'HEADER');
      const bodyPart = message.parts.find(part => part.which === 'TEXT');

      if (headerPart) {
        const from = headerPart.body.from[0];
        console.log('Sender email: ', from);
      }

      if (bodyPart) {
        const emailBody = bodyPart.body;

        // Extract Name, Email Address, and Phone using regular expressions
        const nameMatch = emailBody.match(/Name:\s*(.*)/);
        const emailMatch = emailBody.match(/Email Address:\s*(.*)/);
        const phoneMatch = emailBody.match(/Phone:\s*(.*)/);
        const yearMatch = emailBody.match(/Year:\s*(.*)/);
        const makeMatch = emailBody.match(/Make:\s*(.*)/);
        const modelMatch = emailBody.match(/Model:\s*(.*)/);


        const name = nameMatch ? nameMatch[1].trim() : 'N/A';
        const email = emailMatch ? emailMatch[1].trim() : 'N/A';
        const phone = phoneMatch ? phoneMatch[1].trim() : 'N/A';
        const year = phoneMatch ? yearMatch[1].trim() : 'N/A';
        const make = phoneMatch ? makeMatch[1].trim() : 'N/A';
        const model = phoneMatch ? modelMatch[1].trim() : 'N/A';


        console.log(`Name: ${name}`);
        console.log(`Email: ${email}`);
        console.log(`Phone: ${phone}`);
        console.log(`Vehicle Information`);
        console.log(`Year: ${year}`);
        console.log(`Make: ${make}`);
        console.log(`Model: ${model}`);
        
        if (name && email && phone) {
          // Save to database
          const newCustomer = new customer({ name, email, phone });
          await newCustomer.save();
          console.log(`New customer saved: Name: ${name}, Email: ${email}, Phone: ${phone}`);
        }
        if(year && make && model){
            const newVehicle = new vehicle({year, make, model});
            await newVehicle.save();
          console.log(`New vehicle saved: Year: ${year}, make: ${make}, model: ${model}`);
        }
      } else {
        console.log('No body found in this message.');
      }
    });
  } catch (error) {
    console.error('Error fetching emails: ', error);
  }
}).catch((err) => {
  console.error('IMAP Connection Error: ', err);
});
}

module.exports = fetchEmailsAndSaveLeads ;