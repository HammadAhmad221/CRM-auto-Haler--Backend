const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true,
    //  unique: true
     },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  history: [
    {
      interactionDate: { type: Date, default: Date.now },
      notes: String,
      serviceProvided: String,
    },
  ],
  leads: [
    {
      leadSource: String,
      status: { type: String, enum: ['new', 'contacted', 'qualified', 'converted', 'unqualified'], default:'new'},
      followUpDate: Date,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
