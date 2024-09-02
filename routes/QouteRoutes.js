const router = require('express').Router();
const Quote = require('../models/Qoute');
// const authenticateUser = require('../middlewares/verifyToken');


// Create a new quote
router.post('/', async (req, res) => {
  const { customerId, vehicleId, price, status } = req.body;

  try {
    const newQuote = new Quote({
      customerId,
      vehicleId,
      price,
      status,
    });

    const savedQuote = await newQuote.save();
    res.status(201).json(savedQuote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all quotes
router.get('/', async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.status(200).json(quotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single quote by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const quote = await Quote.findById(id);
    if (!quote) return res.status(404).json({ message: 'Quote not found' });

    res.status(200).json(quote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a quote by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {  customerId, vehicleId, price, status } = req.body;

  try {
    const updatedQuote = await Quote.findByIdAndUpdate(
      id,
      {  customerId, vehicleId, price, status },
      { new: true }
    );

    if (!updatedQuote) return res.status(404).json({ message: 'Quote not found' });

    res.status(200).json(updatedQuote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a quote by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedQuote = await Quote.findByIdAndDelete(id);
    if (!deletedQuote) return res.status(404).json({ message: 'Quote not found' });

    res.status(200).json({ message: 'Quote deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
