const express = require('express');
const router = express.Router();
const CommunicationLog = require('../models/CommunicationLog');
// const authenticateUser = require('../middlewares/verifyToken'); 

// GET all communication logs (with optional filtering by customerId)
router.get('/', async (req, res) => {
  try {
    const { customerId, communicationType, startDate, endDate } = req.query;
    const filter = {};

    if (customerId) filter.customerId = customerId;
    if (communicationType) filter.communicationType = communicationType;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const communicationLogs = await CommunicationLog.find(filter).populate('customerId', 'name email phone');
    res.status(200).json(communicationLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single communication log by ID
router.get('/:id', getCommunicationLog, (req, res) => {
  res.status(200).json(res.communicationLog);
});

// CREATE a new communication log
router.post('/',  async (req, res) => {
  const { customerId, communicationType, message, date } = req.body;

  const communicationLog = new CommunicationLog({
    customerId,
    communicationType,
    message,
    date: date || Date.now(),
  });

  try {
    const newCommunicationLog = await communicationLog.save();
    res.status(201).json(newCommunicationLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a communication log by ID
router.patch('/:id', getCommunicationLog, async (req, res) => {
  const { customerId, communicationType, message, date } = req.body;

  if (customerId) res.communicationLog.customerId = customerId;
  if (communicationType) res.communicationLog.communicationType = communicationType;
  if (message) res.communicationLog.message = message;
  if (date) res.communicationLog.date = date;

  try {
    const updatedCommunicationLog = await res.communicationLog.save();
    res.status(200).json(updatedCommunicationLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a communication log by ID
router.delete('/:id', getCommunicationLog, async (req, res) => {
  try {
    await res.communicationLog.remove();
    res.status(200).json({ message: 'Communication log deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to get a communication log by ID
async function getCommunicationLog(req, res, next) {
  let communicationLog;
  try {
    communicationLog = await CommunicationLog.findById(req.params.id).populate('customerId', 'name email phone');
    if (!communicationLog) {
      return res.status(404).json({ message: 'Communication log not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.communicationLog = communicationLog;
  next();
}

module.exports = router;
