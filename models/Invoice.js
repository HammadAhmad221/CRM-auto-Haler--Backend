// const mongoose = require('mongoose');

// const InvoiceSchema = new mongoose.Schema({
//     customerId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Customer',
//         required: true,
//     },
//     loadId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Load',
//         required: true,
//     },
//     amount: {
//         type: Number,
//         required: true,
//     },
//     status: {
//         type: String,
//         enum:['Paid', 'Unpaid', 'Pending'],
//         default: 'Unpaid',
//     },
//     date: {
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model('Invoice', InvoiceSchema);

const mongoose = require('mongoose');
const Counter = require('./Counter'); // Import the counter model

const InvoiceSchema = new mongoose.Schema({
  invoiceId: {
    type: Number,
    unique: true, // Ensure invoiceId is unique
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  loadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Load',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Pending'],
    default: 'Unpaid',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to auto-increment invoiceId
InvoiceSchema.pre('save', async function (next) {
  const invoice = this;
  if (invoice.isNew) {
    try {
      // Find the counter document for the 'invoiceId' sequence
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'invoiceId' }, // Identifier for the counter specific to invoices
        { $inc: { seq: 1 } }, // Increment the sequence by 1
        { new: true, upsert: true } // Create the counter if it doesn't exist
      );
      // Assign the incremented sequence to invoiceId
      invoice.invoiceId = counter.seq;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
