const router = require('express').Router();
const Invoice = require('../models/Invoice');
// const authenticateUser = require('../middlewares/verifyToken');


// Create a new invoice
router.post('/', async (req, res) => {
  const { customerId, loadId, amount, status } = req.body;

  try {
    const newInvoice = new Invoice({
      customerId,
      loadId,
      amount,
      status,
    });

    const savedInvoice = await newInvoice.save();
    res.status(201).json(savedInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('customerId', 'name').populate('loadId', 'pickupLocation');
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single invoice by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const invoice = await Invoice.findById(id).populate({  path: 'customerId',
      select: 'name address'}).populate('loadId', 'pickupLocation');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an invoice by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { customerId, loadId, amount, status, date } = req.body;

  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      { customerId, loadId, amount, status, date },
      { new: true }
    );

    if (!updatedInvoice) return res.status(404).json({ message: 'Invoice not found' });

    res.status(200).json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an invoice by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(id);
    if (!deletedInvoice) return res.status(404).json({ message: 'Invoice not found' });

    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/invoices/:id', async (req, res) => {
  try {
      const { status } = req.body; // Status should be in the request body
      const { id } = req.params; // ID of the document to update

      const updatedInvoice = await Invoice.findByIdAndUpdate(
          id, 
          { status }, 
          { new: true } // Return the updated document
      ).populate('customerId','name').populate('loadId');

      if (!updatedInvoice) {
          return res.status(404).json({ message: 'Invoice not found' });
      }

      res.json(updatedInvoice);
  } catch (error) {
      console.error('Error updating invoice status:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
