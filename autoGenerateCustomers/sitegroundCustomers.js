// const imaps = require('imap-simple');
// const customer = require('../models/Customer');
// const vehicle = require('../models/Vehicle');

// const config = {
//   imap: {
//     user: 'info@blacklinetransportation.us',
//     password: process.env.WEBMAIL_PASS,
//     host: 'gtxm1192.siteground.biz',
//     port: 993,
//     tls: true,
//     authTimeout: 6000,
//   },
// };

// const fetchEmailsAndSaveLeads =()=>{
//      imaps.connect(config).then(async (connection) => {
//   try {
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

//     messages.forEach(async(message) => {
//       const headerPart = message.parts.find(part => part.which === 'HEADER');
//       const bodyPart = message.parts.find(part => part.which === 'TEXT');

//       if (headerPart) {
//         const from = headerPart.body.from[0];
//         console.log('Sender email: ', from);
//       }

//       if (bodyPart) {
//         const emailBody = bodyPart.body;

//         // Extract Name, Email Address, and Phone using regular expressions
//         const nameMatch = emailBody.match(/Name:\s*(.*)/);
//         const emailMatch = emailBody.match(/Email Address:\s*(.*)/);
//         const phoneMatch = emailBody.match(/Phone:\s*(.*)/);
//         const yearMatch = emailBody.match(/Year:\s*(.*)/);
//         const makeMatch = emailBody.match(/Make:\s*(.*)/);
//         const modelMatch = emailBody.match(/Model:\s*(.*)/);

//         const name = nameMatch && nameMatch[1].trim();
//         const email = emailMatch && emailMatch[1].trim();
//         const phone = phoneMatch && phoneMatch[1].trim();
//         const year = phoneMatch && yearMatch[1].trim();
//         const make = phoneMatch && makeMatch[1].trim();
//         const model = phoneMatch && modelMatch[1].trim();

//         if (name && email && phone) {
//           try{
//             const newCustomer = new customer({ name, email, phone });
//             await newCustomer.save();
//           }catch(error){
//             console.error('Error saving customer', error);
//           }
//           console.log(`New customer saved: Name: ${name}, Email: ${email}, Phone: ${phone}`);
//         }
//         if(year && make && model){
//           try{
//             const newVehicle = new vehicle({year, make, model});
//             await newVehicle.save();
//           }catch(error){
//             console.error("Error saving vehicle", error);
//           }
//           console.log(`New vehicle saved: Year: ${year}, make: ${make}, model: ${model}`);
//         }
//       } else {
//         console.log('No body found in this message.');
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching emails: ', error);
//   }
// }).catch((err) => {
//   console.error('IMAP Connection Error: ', err);
// });
// }

// module.exports = fetchEmailsAndSaveLeads ;

// generating vehicles and customers correctly
// const imaps = require('imap-simple');
// const Customer = require('../models/Customer');
// const Vehicle = require('../models/Vehicle');

// const config = {
//   imap: {
//     user: 'info@blacklinetransportation.us',
//     password: process.env.WEBMAIL_PASS,
//     host: 'gtxm1192.siteground.biz',
//     port: 993,
//     tls: true,
//     authTimeout: 6000,
//   },
// };

// const fetchEmailsAndSaveLeads = async () => {
//   imaps.connect(config).then(async (connection) => {
//     try {
//       await connection.openBox('INBOX');

//       const searchCriteria = ['UNSEEN'];
//       const fetchOptions = {
//         bodies: ['HEADER', 'TEXT'],
//         markSeen: true,
//       };

//       const messages = await connection.search(searchCriteria, fetchOptions);

//       if (messages.length === 0) {
//         console.log('No new emails.');
//         return;
//       }

//       messages.forEach(async (message) => {
//         const headerPart = message.parts.find(part => part.which === 'HEADER');
//         const bodyPart = message.parts.find(part => part.which === 'TEXT');

//         if (bodyPart) {
//           const emailBody = bodyPart.body;

//           // Extract Name, Email Address, Phone, and Vehicle Info using regex
//           const nameMatch = emailBody.match(/Name:\s*(.*)/);
//           const emailMatch = emailBody.match(/Email Address:\s*(.*)/);
//           const phoneMatch = emailBody.match(/Phone:\s*(.*)/);
//           const yearMatch = emailBody.match(/Year:\s*(.*)/);
//           const makeMatch = emailBody.match(/Make:\s*(.*)/);
//           const modelMatch = emailBody.match(/Model:\s*(.*)/);

//           const name = nameMatch && nameMatch[1].trim();
//           const email = emailMatch && emailMatch[1].trim();
//           const phone = phoneMatch && phoneMatch[1].trim();
//           const year = yearMatch && yearMatch[1].trim();
//           const make = makeMatch && makeMatch[1].trim();
//           const model = modelMatch && modelMatch[1].trim();

//           if (name && email && phone) {
//             try {
//               // Check if the customer already exists
//               let existingCustomer = await Customer.findOne({ email });

//               if (!existingCustomer) {
//                 // Create a new customer if it doesn't exist
//                 existingCustomer = new Customer({ name, email, phone });
//                 await existingCustomer.save();
//                 console.log(`New customer saved: ${name}, Email: ${email}`);
//               }

//               if (year && make && model) {
//                 // Save vehicle with reference to customer
//                 const newVehicle = new Vehicle({
//                   year,
//                   make,
//                   model,
//                   customer: existingCustomer._id // Link customer to vehicle
//                 });
//                 await newVehicle.save();
//                 console.log(`New vehicle saved: Year: ${year}, Make: ${make}, Model: ${model}, Customer: ${existingCustomer.name}`);
//               }
//             } catch (error) {
//               console.error('Error saving customer or vehicle', error);
//             }
//           } else {
//             console.log('Missing customer or vehicle data in email.');
//           }
//         } else {
//           console.log('No body found in this message.');
//         }
//       });
//     } catch (error) {
//       console.error('Error fetching emails: ', error);
//     }
//   }).catch((err) => {
//     console.error('IMAP Connection Error: ', err);
//   });
// }

// module.exports = fetchEmailsAndSaveLeads;

// code ended here with autogenerated customers and vehicles

// generate lead with customer, vehicle and load

const imaps = require("imap-simple");
const Customer = require("../models/Customer");
const Vehicle = require("../models/Vehicle");
const Load = require("../models/Load");

const config = {
  imap: {
    user: "info@blacklinetransportation.us",
    password: process.env.WEBMAIL_PASS,
    host: "gtxm1192.siteground.biz",
    port: 993,
    tls: true,
    authTimeout: 30000,
  },
};

const fetchEmailsAndSaveLeads = async () => {
  imaps
    .connect(config)
    .then(async (connection) => {
      try {
        await connection.openBox("INBOX");

        const searchCriteria = ["UNSEEN"];
        const fetchOptions = {
          bodies: ["HEADER", "TEXT"],
          markSeen: true,
        };

        const messages = await connection.search(searchCriteria, fetchOptions);

        if (messages.length === 0) {
          console.log("No new emails.");
          return;
        }

        messages.forEach(async (message) => {
          const headerPart = message.parts.find(
            (part) => part.which === "HEADER"
          );
          const bodyPart = message.parts.find((part) => part.which === "TEXT");

          if (bodyPart) {
            const emailBody = bodyPart.body;

            // Extract Name, Email Address, Phone, and Vehicle Info using regex
            const nameMatch = emailBody.match(/Name:\s*(.*)/);
            const emailMatch = emailBody.match(/Email Address:\s*(.*)/);
            const phoneMatch = emailBody.match(/Phone:\s*(.*)/);
            const yearMatch = emailBody.match(/Year:\s*(.*)/);
            const makeMatch = emailBody.match(/Make:\s*(.*)/);
            const modelMatch = emailBody.match(/Model:\s*(.*)/);
            const pickupCityMatch = emailBody.match(/Pickup City:\s*(.*)/);
            const pickupStateMatch = emailBody.match(/Pickup State:\s*(.*)/);
            const pickupZipcodeMatch = emailBody.match(
              /Pickup Zipcode:\s*(.*)/
            );
            const deliveryCityMatch = emailBody.match(/Delivery City:\s*(.*)/);
            const deliveryStateMatch = emailBody.match(
              /Delivery State:\s*(.*)/
            );
            const deliveryZipcodeMatch = emailBody.match(
              /Delivery Zipcode:\s*(.*)/
            );

            const name = nameMatch && nameMatch[1].trim();
            const email = emailMatch && emailMatch[1].trim();
            const phone = phoneMatch && phoneMatch[1].trim();
            const year = yearMatch && yearMatch[1].trim();
            const make = makeMatch && makeMatch[1].trim();
            const model = modelMatch && modelMatch[1].trim();

            // New fields for the Load
            const pickupLocation = `${
              pickupCityMatch ? pickupCityMatch[1].trim() : ""
            }, ${pickupStateMatch ? pickupStateMatch[1].trim() : ""} ${
              pickupZipcodeMatch ? pickupZipcodeMatch[1].trim() : ""
            }`;
            const deliveryLocation = `${
              deliveryCityMatch ? deliveryCityMatch[1].trim() : ""
            }, ${deliveryStateMatch ? deliveryStateMatch[1].trim() : ""} ${
              deliveryZipcodeMatch ? deliveryZipcodeMatch[1].trim() : ""
            }`;

            if (name && email && phone) {
              try {
                // Check if the customer already exists
                let existingCustomer = await Customer.findOne({ email });

                if (!existingCustomer) {
                  // Create a new customer if it doesn't exist
                  existingCustomer = new Customer({ name, email, phone });
                  await existingCustomer.save();
                  console.log(`New customer saved: ${name}, Email: ${email}`);
                }

                if (year && make && model) {
                  // Save vehicle with reference to customer
                  const newVehicle = new Vehicle({
                    year,
                    make,
                    model,
                    customer: existingCustomer._id, // Link customer to vehicle
                  });
                  await newVehicle.save();
                  console.log(
                    `New vehicle saved: Year: ${year}, Make: ${make}, Model: ${model}, Customer: ${existingCustomer.name}`
                  );

                  // Create a Load with the required fields
                  const newLoad = new Load({
                    deliveryLocation,
                    pickupLocation,
                    customerId: existingCustomer._id, // Link customer to load
                    vehicleId: newVehicle._id, // Link vehicle to load
                    amount: null, // Set amount as null
                    driver: null, // Set driver as null
                    status: "Pending", // Set status to Pending
                  });

                  await newLoad.save();
                  console.log(
                    `New load created: Pickup Location: ${pickupLocation}, Delivery Location: ${deliveryLocation}, Customer: ${existingCustomer.name}`
                  );
                }
              } catch (error) {
                console.error("Error saving customer or vehicle", error);
              }
            } else {
              console.log("Missing customer or vehicle data in email.");
            }
          } else {
            console.log("No body found in this message.");
          }
        });
      } catch (error) {
        console.error("Error fetching emails: ", error);
      }
    })
    .catch((err) => {
      console.error("IMAP Connection Error: ", err);
    });
};

module.exports = fetchEmailsAndSaveLeads;

// generate whole lead code ends here

// const imaps = require("imap-simple");
// const Customer = require("../models/Customer");
// const Vehicle = require("../models/Vehicle");
// const Load = require("../models/Load");

// const config = {
//   imap: {
//     user: "info@blacklinetransportation.us",
//     password: process.env.WEBMAIL_PASS,
//     host: "gtxm1192.siteground.biz",
//     port: 993,
//     tls: true,
//     authTimeout: 30000,
//   },
// };

// // Function to fetch emails in batches and save leads
// const fetchEmailsInBatches = async (
//   connection,
//   startUID = 1,
//   batchSize = 100
// ) => {
//   let allEmailsFetched = false;

//   while (!allEmailsFetched) {
//     const endUID = startUID + batchSize - 1;
//     const searchCriteria = [
//       ["UID", `${startUID}:${endUID}`], // Fetch emails in a batch by UID range
//     ];
//     const fetchOptions = {
//       bodies: ["HEADER", "TEXT"],
//       struct: true,
//     };

//     try {
//       const messages = await connection.search(searchCriteria, fetchOptions);

//       if (messages.length === 0) {
//         console.log("No more new emails.");
//         allEmailsFetched = true;
//         break;
//       }

//       // Process each email
//       for (const message of messages) {
//         const headerPart = message.parts.find(
//           (part) => part.which === "HEADER"
//         );
//         const bodyPart = message.parts.find((part) => part.which === "TEXT");

//         if (bodyPart) {
//           const emailBody = bodyPart.body;

//           // Extract data using regex
//           const nameMatch = emailBody.match(/Name:\s*(.*)/);
//           const emailMatch = emailBody.match(/Email Address:\s*(.*)/);
//           const phoneMatch = emailBody.match(/Phone:\s*(.*)/);
//           const yearMatch = emailBody.match(/Year:\s*(.*)/);
//           const makeMatch = emailBody.match(/Make:\s*(.*)/);
//           const modelMatch = emailBody.match(/Model:\s*(.*)/);
//           const pickupCityMatch = emailBody.match(/Pickup City:\s*(.*)/);
//           const pickupStateMatch = emailBody.match(/Pickup State:\s*(.*)/);
//           const pickupZipcodeMatch = emailBody.match(/Pickup Zipcode:\s*(.*)/);
//           const deliveryCityMatch = emailBody.match(/Delivery City:\s*(.*)/);
//           const deliveryStateMatch = emailBody.match(/Delivery State:\s*(.*)/);
//           const deliveryZipcodeMatch = emailBody.match(
//             /Delivery Zipcode:\s*(.*)/
//           );

//           const name = nameMatch && nameMatch[1].trim();
//           const email = emailMatch && emailMatch[1].trim();
//           const phone = phoneMatch && phoneMatch[1].trim();
//           const year = yearMatch && yearMatch[1].trim();
//           const make = makeMatch && makeMatch[1].trim();
//           const model = modelMatch && modelMatch[1].trim();

//           const pickupLocation = `${
//             pickupCityMatch ? pickupCityMatch[1].trim() : ""
//           }, ${pickupStateMatch ? pickupStateMatch[1].trim() : ""} ${
//             pickupZipcodeMatch ? pickupZipcodeMatch[1].trim() : ""
//           }`;

//           const deliveryLocation = `${
//             deliveryCityMatch ? deliveryCityMatch[1].trim() : ""
//           }, ${deliveryStateMatch ? deliveryStateMatch[1].trim() : ""} ${
//             deliveryZipcodeMatch ? deliveryZipcodeMatch[1].trim() : ""
//           }`;

//           if (name && email && phone) {
//             try {
//               // Check if customer exists
//               let existingCustomer = await Customer.findOne({ email });

//               if (!existingCustomer) {
//                 // Create new customer
//                 existingCustomer = new Customer({ name, email, phone });
//                 await existingCustomer.save();
//                 console.log(`New customer saved: ${name}, Email: ${email}`);
//               }

//               if (year && make && model) {
//                 // Save vehicle and link it to customer
//                 const newVehicle = new Vehicle({
//                   year,
//                   make,
//                   model,
//                   customer: existingCustomer._id, // Link customer to vehicle
//                 });
//                 await newVehicle.save();
//                 console.log(
//                   `New vehicle saved: Year: ${year}, Make: ${make}, Model: ${model}, Customer: ${existingCustomer.name}`
//                 );

//                 // Create Load and link customer and vehicle
//                 const newLoad = new Load({
//                   deliveryLocation,
//                   pickupLocation,
//                   customerId: existingCustomer._id, // Link customer to load
//                   vehicleId: newVehicle._id, // Link vehicle to load
//                   amount: null,
//                   driver: null,
//                   status: "Pending",
//                 });

//                 await newLoad.save();
//                 console.log(
//                   `New load created: Pickup Location: ${pickupLocation}, Delivery Location: ${deliveryLocation}, Customer: ${existingCustomer.name}`
//                 );
//               }
//             } catch (error) {
//               console.error("Error saving customer or vehicle", error);
//             }
//           } else {
//             console.log("Missing customer or vehicle data in email.");
//           }
//         } else {
//           console.log("No body found in this message.");
//         }
//       }

//       // Update startUID to fetch the next batch
//       const lastEmail = messages[messages.length - 1];
//       startUID = lastEmail.attributes.uid + 1;

//       // Stop fetching if the number of emails in this batch is less than batchSize
//       if (messages.length < batchSize) {
//         allEmailsFetched = true;
//       }
//     } catch (error) {
//       console.error("Error fetching batch of emails: ", error);
//       break;
//     }
//   }
// };

// // Main function to connect to IMAP and fetch emails
// const fetchEmailsAndSaveLeads = async () => {
//   imaps
//     .connect(config)
//     .then(async (connection) => {
//       try {
//         await connection.openBox("INBOX");
//         // Fetch emails in batches
//         await fetchEmailsInBatches(connection);
//       } catch (error) {
//         console.error("Error fetching emails: ", error);
//       }
//     })
//     .catch((err) => {
//       console.error("IMAP Connection Error: ", err);
//     });
// };

// module.exports = fetchEmailsAndSaveLeads;
