// const nodemailer = require('nodemailer');

// // Create a transporter object
// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',  // Use your email provider's SMTP server (Gmail used here)
//   port: 587,  // For TLS encryption
//   secure: false,  // Set to true if using port 465 (SSL)
//   auth: {
//     user: 'hammadchahal123@gmail.com',  // Your email address
//     pass: 'nauq uhcs nvdr kazz',  // Your email password or App password
//   },
// });

// // Function to send email
// const sendInvoiceEmail = (recipientEmail, invoiceDetails) => {
//   const mailOptions = {
//     from: 'hammadchahal123@gmail.com',  // Sender address
//     to: recipientEmail,  // Recipient's email address
//     subject: 'Invoice Status Update',  // Subject line
//     html: `
//       <p>Dear Customer,</p>
//       <p>Your invoice with ID: <strong>${invoiceDetails._id}</strong> has been updated.</p>
//       <p>Status: <strong>${invoiceDetails.status}</strong></p>
//       <p>Amount: <strong>${invoiceDetails.amount}</strong></p>
//       <p>Thank you for using our service.</p>
//       <p>Best regards,</p>
//       <p>MetaViz Pro</p>
//     `,
//   };

//   // Send the email
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error('Error sending email:', error);
//     } else {
//       console.log('Email sent:', info.response);
//     }
//   });
// };

// module.exports = sendInvoiceEmail;

const nodemailer = require('nodemailer');

// Function to send an email when the invoice is created
const sendInvoiceEmail = async ({ email, invoiceId, loadDetails, invoiceAmount, invoiceStatus }) => {
  // Create the email transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hammadchahal123@gmail.com',
      pass: 'nauq uhcs nvdr kazz', // Use app password if you're using Gmail
    },
  });

  // Email content
  const mailOptions = {
    from: 'hammadchahal123@gmail.com',
    to: email,  // Customer's email
    subject: `Invoice #${invoiceId} Created`,
    text: `
      Hello,

      Your invoice has been created with the following details:

      Invoice ID: ${invoiceId}
      Amount: ${invoiceAmount}
      Status: ${invoiceStatus}

      click the below link to view and download your Invoice:
        https://sea-lion-app-72vh4.ondigitalocean.app/invoices/${invoiceId}


      Thank you!
    `,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendInvoiceEmail;
