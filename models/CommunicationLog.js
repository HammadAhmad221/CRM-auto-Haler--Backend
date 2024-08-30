const mongoose = require('mongoose');

const CommunicationLogSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    communicationType: {
        type: String,
        enum:['Email', 'Phone', 'SMS'],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CommunicationLog', CommunicationLogSchema);
