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
    to: email, 
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
