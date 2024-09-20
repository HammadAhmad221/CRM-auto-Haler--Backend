// const mongoose = require('mongoose');

// const LoadSchema = new mongoose.Schema({
//     vehicleId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Vehicle',
//         required: true,
//     },
//     driverId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Driver',
//         required: true,
//     },
//     pickupLocation: {
//         type: String,
//         required: true,
//     },
//     deliveryLocation: {
//         type: String,
//         required: true,
//     },
//     loadDetails: {
//         type: String,
//     },
//     status: {
//         type: String,
//         enum:['Assigned', 'In Progress', 'Delivered'],
//         default: 'Assigned',
//     },
//     date: {
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model('Load', LoadSchema);


const mongoose = require('mongoose');
const Counter = require('./Counter'); // Import the counter model

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
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
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
    enum: ['Assigned', 'In Progress', 'Delivered'],
    default: 'Assigned',
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

