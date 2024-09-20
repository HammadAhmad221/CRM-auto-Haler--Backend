const router = require('express').Router();
const Driver = require('../models/Driver');
const authenticateUser = require('../middlewares/verifyToken');



// Create a new driver
router.post('/',   async (req, res) => {
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
router.get('/',  async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single driver by ID
router.get('/:id', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id',  async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDriver = await Driver.findByIdAndDelete(id);
    if (!deletedDriver) return res.status(404).json({ message: 'Driver not found' });

    res.status(200).json({ message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/id-by-email/:email', async (req, res) => {
  try {
      const driver = await Driver.findOne({ "contactDetails.email": req.params.email });
      if (!driver) {
          return res.status(404).json({ message: 'Driver not found' });
      }
      res.json({ driverId: driver._id });
  } catch (error) {
      console.error('Error fetching driver by license number:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
