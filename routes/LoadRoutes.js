const router = require('express').Router();
const Load = require('../models/Load');
// const authenticateUser = require('../middlewares/verifyToken');


// Create a new load
router.post('/', async (req, res) => {
  const { loadDetails, pickupLocation, deliveryLocation, status, vehicleId, driverId } = req.body;

  try {
    const newLoad = new Load({
      loadDetails,
      pickupLocation,
      deliveryLocation,
      status,
      vehicleId,
      driverId,
    });

    const savedLoad = await newLoad.save();
    res.status(201).json(savedLoad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all loads
router.get('/', async (req, res) => {
  try {
    const loads = await Load.find();
    res.status(200).json(loads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single load by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const load = await Load.findById(id);
    if (!load) return res.status(404).json({ message: 'Load not found' });

    res.status(200).json(load);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a load by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { loadDetails, pickupLocation, deliveryLocation, status, vehicleId, driverId } = req.body;

  try {
    const updatedLoad = await Load.findByIdAndUpdate(
      id,
      { loadDetails, pickupLocation, deliveryLocation, status, vehicleId, driverId },
      { new: true }
    );

    if (!updatedLoad) return res.status(404).json({ message: 'Load not found' });

    res.status(200).json(updatedLoad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a load by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedLoad = await Load.findByIdAndDelete(id);
    if (!deletedLoad) return res.status(404).json({ message: 'Load not found' });

    res.status(200).json({ message: 'Load deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
