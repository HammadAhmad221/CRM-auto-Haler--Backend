const router = require('express').Router();
const Vehicle = require('../models/Vehicle');
// const authenticateUser = require('../middlewares/verifyToken');

router.get('/', async (req, res) => {
  try {
    // Get query parameters for pagination
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skip = (page - 1) * limit;

    // Fetch vehicles with pagination and populate the customer field
    const vehicles = await Vehicle.find()
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 }) // Sort by latest first (optional)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination metadata
    const totalRecords = await Vehicle.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalRecords / limit);

    // Return vehicles data with pagination info
    res.status(200).json({
      data: vehicles,
      currentPage: page,
      totalPages,
      totalRecords,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Create a new vehicle
router.post('/', async (req, res) => {
  const { make, model, year } = req.body;

  try {
    const newVehicle = new Vehicle({
      make,
      model,
      year
    });

    const savedVehicle = await newVehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single vehicle by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const vehicle = await Vehicle.findById(id).populate('customer', 'name email phone');
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a vehicle by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { make, model, year,  } = req.body;

  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      { make, model, year },
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
