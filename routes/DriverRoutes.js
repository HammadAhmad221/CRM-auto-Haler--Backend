const router = require('express').Router();
const Driver = require('../models/Driver');
const authenticateUser = require('../middlewares/verifyToken');


// Create a new driver
router.post('/', authenticateUser(['Admin']), async (req, res) => {
  const { name, licenseNumber, certifications, contactDetails } = req.body;

  try {
    const newDriver = new Driver({
      name,
      licenseNumber,
      certifications,
      contactDetails
    });

    const savedDriver = await newDriver.save();
    res.status(201).json(savedDriver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all drivers
router.get('/',authenticateUser(['Admin']), async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single driver by ID
router.get('/:id',authenticateUser(['Admin']), async (req, res) => {
  const { id } = req.params;

  try {
    const driver = await Driver.findById(id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a driver by ID
router.put('/:id', authenticateUser(['Admin']), async (req, res) => {
  const { id } = req.params;
  const { name, licenseNumber, certifications, contactDetails } = req.body;

  try {
    // Create an object with only the fields that are part of the Driver schema
    const updatedData = {
      name,
      licenseNumber,
      certifications,
      contactDetails
    };

    const updatedDriver = await Driver.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true } // Ensure validators are run
    );

    if (!updatedDriver) return res.status(404).json({ message: 'Driver not found' });

    res.status(200).json(updatedDriver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a driver by ID
router.delete('/:id',authenticateUser(['Admin']), async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDriver = await Driver.findByIdAndDelete(id);
    if (!deletedDriver) return res.status(404).json({ message: 'Driver not found' });

    res.status(200).json({ message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
