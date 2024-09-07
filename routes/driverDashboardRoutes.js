const express = require('express');
const Driver = require('../models/Driver');
const Load = require('../models/Load');
const ConditionReport = require('../models/ConditionReport');

const router = express.Router();


// Get assigned loads for the authenticated driver
router.get('/driver/:driverId', async (req, res) => {
    try {
        const loads = await Load.find({ driverId: req.params.driverId });
        res.status(200).json(loads);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

// Update load status (picked up, in transit, delivered)
// router.patch('/loads/:id/status', async (req, res) => {
//     const { status } = req.body;
//     try {
//         const load = await Load.findById(req.params.id);
//         if (!load) return res.status(404).send({ error: 'Load not found' });

//         if (load.driverId.toString() !== req.driver.id) {
//             return res.status(403).send({ error: 'Unauthorized' });
//         }

//         load.status = status;
//         await load.save();
//         res.status(200).json(load);
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to update load status' });
//     }
// });
router.put('/driver/:loadId', async (req, res) => {
    try {
        const { loadId } = req.params;
        const { status } = req.body;

        // Find the load by ID and update its status
        const load = await Load.findByIdAndUpdate(loadId, { status }, { new: true });

        if (!load) {
            return res.status(404).json({ message: 'Load not found' });
        }

        res.json({ message: 'Load status updated successfully', load });
    } catch (error) {
        console.error('Error updating load status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Submit condition reports
router.post('/condition-reports', async (req, res) => {
    const { vehicleId, report } = req.body;
    try {
        const conditionReport = new ConditionReport({
            vehicleId,
            report
        });

        await conditionReport.save();
        res.status(201).json(conditionReport);
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit condition report' });
    }
});

// Profile management: Get driver profile
router.get('/profile', async (req, res) => {
    try {
        const driver = await Driver.findById(req.driver.id);
        if (!driver) return res.status(404).send({ error: 'Driver not found' });

        res.status(200).json(driver);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Profile management: Update driver profile
router.patch('/profile', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'licenseNumber', 'certifications', 'contactDetails'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' });
    }

    try {
        const driver = await Driver.findById(req.driver.id);
        if (!driver) return res.status(404).send({ error: 'Driver not found' });

        updates.forEach(update => driver[update] = req.body[update]);
        await driver.save();
        res.status(200).json(driver);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

module.exports = router;
