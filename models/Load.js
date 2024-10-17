const mongoose = require('mongoose');
const Counter = require('./Counter');

const LoadSchema = new mongoose.Schema({
  loadId: {
    type: Number,
    unique: true,
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null,
    // required: true,
  },
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    default: null,
  },
  amount:{
    type:Number,
    default: null,
    // require:true,
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  deliveryLocation: {
    type: String,
    required: true,
  },
  loadDetails: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Assigned', 'In Progress', 'Delivered', 'Pending'],
    default: 'Pending',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to auto-increment loadId
LoadSchema.pre('save', async function (next) {
  const load = this;
  if (load.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'loadId' }, // This will be the identifier for the counter
        { $inc: { seq: 1 } }, // Increment the sequence by 1
        { new: true, upsert: true } // Create the counter if it doesn't exist
      );
      load.loadId = counter.seq; // Assign the incremented value to loadId
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Load', LoadSchema);

