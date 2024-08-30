const express = require('express');
const router = express.Router();
const ConditionReport = require('../models/ConditionReport');
// const authenticateUser = require('../middlewares/verifyToken');

// GET all condition reports (with optional filtering by vehicleId)
router.get('/', async (req, res) => {
  try {
    const { vehicleId, startDate, endDate } = req.query;  // Removed reportType
    const filter = {};

    if (vehicleId) filter.vehicleId = vehicleId;  // Updated to vehicleId
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const conditionReports = await ConditionReport.find(filter).populate('vehicleId', 'name description'); // Updated to vehicleId
    res.status(200).json(conditionReports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single condition report by ID
router.get('/:id', getConditionReport, (req, res) => {
  res.status(200).json(res.conditionReport);
});

// CREATE a new condition report
router.post('/', async (req, res) => {
  const { vehicleId, report, date } = req.body;  // Updated to vehicleId and report

  const conditionReport = new ConditionReport({
    vehicleId,  // Updated to vehicleId
    report,  // Updated to report
    date: date || Date.now(),
  });

  try {
    const newConditionReport = await conditionReport.save();
    res.status(201).json(newConditionReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a condition report by ID
router.patch('/:id', getConditionReport, async (req, res) => {
  const { vehicleId, report, date } = req.body;  // Updated to vehicleId and report

  if (vehicleId) res.conditionReport.vehicleId = vehicleId;  // Updated to vehicleId
  if (report) res.conditionReport.report = report;  // Updated to report
  if (date) res.conditionReport.date = date;

  try {
    const updatedConditionReport = await res.conditionReport.save();
    res.status(200).json(updatedConditionReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a condition report by ID
router.delete('/:id', getConditionReport, async (req, res) => {
  try {
    await res.conditionReport.remove();
    res.status(200).json({ message: 'Condition report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to get a condition report by ID
async function getConditionReport(req, res, next) {
  let conditionReport;
  try {
    conditionReport = await ConditionReport.findById(req.params.id).populate('vehicleId', 'name description');  // Updated to vehicleId
    if (!conditionReport) {
      return res.status(404).json({ message: 'Condition report not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.conditionReport = conditionReport;
  next();
}

module.exports = router;
