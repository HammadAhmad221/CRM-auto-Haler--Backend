const express = require('express');
const multer = require('multer');
const path = require('path');
const ConditionReport = require('../models/ConditionReport');

const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// POST api/reports/submit - Submit Condition Report
router.post('/submit', upload.fields([{ name: 'pickupPhotos' }, { name: 'deliveryPhotos' }]), async (req, res) => {
    try {
        const { driverId, loadId } = req.body;

        const newReport = new ConditionReport({
            driverId,
            loadId,
            pickupConditionPhotos: req.files.pickupPhotos ? req.files.pickupPhotos.map(file => file.path) : [],
            deliveryConditionPhotos: req.files.deliveryPhotos ? req.files.deliveryPhotos.map(file => file.path) : [],
        });

        await newReport.save();

        res.json({ message: 'Condition report submitted successfully', report: newReport });
    } catch (error) {
        console.error('Error submitting condition report:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
