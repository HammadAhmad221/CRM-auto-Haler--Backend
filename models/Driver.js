const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true,
    },
    certifications: {
        type: [String],
    },
    contactDetails: {
        phoneNumber: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Driver', DriverSchema);
