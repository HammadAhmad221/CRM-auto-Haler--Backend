const router = require('express').Router();
const Vehicle = require('../models/Vehicle');
// const authenticateUser = require('../middlewares/verifyToken');


// Create a new vehicle
router.post('/', async (req, res) => {
  const { make, model, year, vin, specialInstructions, status, conditionReport  } = req.body;

  try {
    const newVehicle = new Vehicle({
      make,
      model,
      year,
      vin,
      specialInstructions,
      status,
      conditionReport 
    });

    const savedVehicle = await newVehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single vehicle by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a vehicle by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { make, model, year, vin, specialInstructions, status, conditionReport } = req.body;

  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      { make, model, year, vin, specialInstructions, status, conditionReport },
      { new: true }
    );

    if (!updatedVehicle) return res.status(404).json({ message: 'Vehicle not found' });

    res.status(200).json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a vehicle by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(id);
    if (!deletedVehicle) return res.status(404).json({ message: 'Vehicle not found' });

    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
