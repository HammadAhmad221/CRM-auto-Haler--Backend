const router = require('express').Router();
const Load = require('../models/Load');
// const authenticateUser = require('../middlewares/verifyToken');


// Create a new load
router.post('/', async (req, res) => {
  const { loadDetails, pickupLocation, deliveryLocation, status, vehicleId, driverId, customerId, amount } = req.body;

  try {
    const newLoad = new Load({
      loadDetails,
      pickupLocation,
      deliveryLocation,
      status,
      vehicleId,
      driverId,
      customerId,
      amount,
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
    const loads = await Load.find().populate('driverId','name').populate('vehicleId','make model year vin').populate('customerId','name');
    res.status(200).json(loads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single load by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const load = await Load.findById(id).populate({  path: 'driverId',
      select: 'name'}).populate({path:'vehicleId',select:'make model year'}).populate('customerId','name email phone').populate('invoiceId',"invoiceId")
    if (!load) return res.status(404).json({ message: 'Load not found' });

    res.status(200).json(load);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a load by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { loadDetails, pickupLocation, deliveryLocation, status, vehicleId, driverId, customerId, amount } = req.body;

  try {
    const updatedLoad = await Load.findByIdAndUpdate(
      id,
      { loadDetails, pickupLocation, deliveryLocation, status, vehicleId, driverId, customerId, amount },
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

// Create a load based on an approved quote
router.post('/from-quote/:quoteId', async (req, res) => {
  const { quoteId } = req.params;
  const { driverId, pickupLocation, deliveryLocation } = req.body;

  try {
    const quote = await Quote.findById(quoteId);
    if (!quote || quote.status !== 'Approved') {
      return res.status(400).json({ message: 'Quote not found or not approved' });
    }

    // Create a new Load based on the approved quote
    const newLoad = new Load({
      vehicleId: quote.vehicleId,
      driverId,
      pickupLocation,
      deliveryLocation,
      loadDetails: `Load created from quote ID ${quoteId}`,
      status: 'Assigned', // Or whatever initial status you use
    });

    const savedLoad = await newLoad.save();
    res.status(201).json(savedLoad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
