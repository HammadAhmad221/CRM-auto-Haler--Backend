const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  vin: { type: String, required: true
  //  unique: true 
    },
specialInstructions: {type: String, require: true},
  // status: { type: String,
  //    enum: ['pending', 'picked-up', 'in-transit', 'delivered'],
  //     default: 'pending' },
  conditionReport:{
      conditionAtPickup: String,
      conditionAtDelivery: String,
      notes: String,
      date: { type: Date, default: Date.now },
    },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
