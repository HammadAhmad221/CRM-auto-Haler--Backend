const nodemailer = require('nodemailer');

// Function to send an email when the invoice is created
const sendInvoiceEmail = async ({ email, invoiceId, invoiceAmount, invoiceStatus, invoiceIdN }) => {
  // Create the email transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dpointlogistics@gmail.com',
      pass: process.env.GMAIL_PASS,
    },
  });

  // Email content
  const mailOptions = {
    from: 'dpointlogistics@gmail.com',
    to: email, 
    subject: `Your Invoice is created by ID#${invoiceIdN}`,
    text: `
      Hello,

      Your invoice has been created with the following details:

      Invoice ID: ${invoiceIdN}
      Amount: $${invoiceAmount}.00
      Status: ${invoiceStatus}

      click the below link to view and download your Invoice:
        https://sea-lion-app-72vh4.ondigitalocean.app/invoices/${invoiceId}


      Thank you!
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendInvoiceEmail;
