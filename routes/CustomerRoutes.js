const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
// const authenticateUser = require('../middlewares/verifyToken');

// Get all customers (Read)
// router.get('/',   async (req, res) => {
//   try {
//     const customers = await Customer.find();
//     res.json(customers);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

router.get('/', async (req, res) => {
  try {
    // Get query parameters for pagination
    const page = parseInt(req.query.page); // Default to page 1
    const limit = parseInt(req.query.limit);
    const skip = (page - 1) * limit;

    // Fetch customers with pagination and sorting (latest first)
    const customers = await Customer.find()
      .sort({ createdAt: -1 }) // Sort by latest first
      .skip(skip)
      .limit(limit);

    // Get total count for pagination metadata
    const totalRecords = await Customer.countDocuments();

    res.json({
      data: customers,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get one customer by ID (Read)
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new customer (Create)
router.post('/', async (req, res) => {
  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    // address: req.body.address,
    // history: req.body.history,
    // leads: req.body.leads,
  });

  try {
    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a customer by ID (Update)
router.put('/:id',   async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.json(updatedCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a customer by ID (Delete)
router.delete('/:id',   async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
