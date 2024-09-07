const mongoose = require('mongoose');

const ConditionReport = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true,
    },
    loadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Load',
        required: true,
    },
    pickupConditionPhotos: {
        type: [String], // Array of file paths
    },
    deliveryConditionPhotos: {
        type: [String], // Array of file paths
    },
    reportDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('ConditionReport', ConditionReport);
