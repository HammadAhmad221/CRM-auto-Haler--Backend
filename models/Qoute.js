// const mongoose = require('mongoose');

// const QuoteSchema = new mongoose.Schema({
//     customerId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Customer',
//         required: true,
//     },
//     vehicleId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Vehicle',
//     },
//     price: {
//         type: Number,
//         required: true,
//     },
//     status: {
//         type: String,
//         enum:['Pending', 'Approved', 'Rejected'],
//         default: 'Pending',
//     },
//     date: {
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model('Quote', QuoteSchema);

const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
    },
    distance: {
        type: Number,
        required: true,
        min: 0, // Assuming distance cannot be negative
    },
    vehicleType: {
        type: String,
        enum: ['Sedan', 'SUV', 'Truck', 'Van'],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
    date: {
        type: Date,
        default: Date.now,
    },
    // factors: {
    //     type: Map,
    //     of: String,
    // },
});

module.exports = mongoose.model('Quote', QuoteSchema);
