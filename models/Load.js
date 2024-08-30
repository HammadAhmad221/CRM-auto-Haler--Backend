const mongoose = require('mongoose');

const LoadSchema = new mongoose.Schema({
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
        enum:['Assigned', 'In Transit', 'Delivered'],
        default: 'Assigned',
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Load', LoadSchema);
