const mongoose = require('mongoose');

const ConditionReportSchema = new mongoose.Schema({
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    report: {
        type: String, // Details about the vehicle's condition
    }
});

module.exports = mongoose.model('ConditionReport', ConditionReportSchema);
