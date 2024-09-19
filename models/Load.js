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
    id: {
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
    }
});

// Pre-save middleware to auto-increment the loadId before saving
LoadSchema.pre('save', async function (next) {
    const load = this;

    // Only auto-increment if the loadId field is not already set
    if (!load.isNew || load.loadId) {
        return next();
    }

    try {
        // Find the counter document for the "Load" model and increment the sequence
        const counter = await Counter.findOneAndUpdate(
            { model: 'Load' },
            { $inc: { seq: 1 } }, // Increment the sequence by 1
            { new: true, upsert: true } // Create the counter if it doesn't exist
        );

        // Set the loadId to the incremented sequence value
        load.loadId = counter.seq;
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Load', LoadSchema);
