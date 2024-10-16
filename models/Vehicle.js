// const mongoose = require('mongoose');

// const vehicleSchema = new mongoose.Schema({
//   make: { type: String, required: true },
//   model: { type: String, required: true },
//   year: { type: Number, required: true },
// }, { timestamps: true });

// module.exports = mongoose.model('Vehicle', vehicleSchema);
// models/Vehicle.js
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }, // Reference to Customer
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
