const router = require('express').Router();
const Invoice = require('../models/Invoice');
const Load = require("../models/Load");
const sendInvoiceEmail = require('../mail');

router.post('/', async (req, res) => {
  const { customerId, loadId, amount, status } = req.body;

  try {
    const newInvoice = new Invoice({
      customerId,
      loadId,
      // amount,
      status,
    });

    const savedInvoice = await newInvoice.save();
    // console.log("saved ");
    await Load.findByIdAndUpdate(loadId, { invoiceId: newInvoice._id });
    // console.log(saved);

    const populatedInvoice = await Invoice.findById(savedInvoice._id)
      .populate('customerId')
      .populate('loadId');

      await Invoice.findByIdAndUpdate(savedInvoice._id,{amount:populatedInvoice.loadId.amount});

      // console.log("Subject invoices",populatedInvoice);

    const customerEmail = populatedInvoice.customerId.email;
    // console.log("customer email",customerEmail);
    const loadDetails = populatedInvoice.loadId;

    await sendInvoiceEmail({
      email: customerEmail,     
      invoiceId: populatedInvoice._id,
      loadDetails: loadDetails, 
      invoiceAmount: populatedInvoice.loadId.amount,    
      invoiceStatus: status,
      invoiceIdN:populatedInvoice.invoiceId,
    });
    res.status(201).json(populatedInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('customerId', 'name').populate({path:'loadId', select:'pickupLocation loadId deliveryLocation'});
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// router.get('/stats', async (req, res) => {
//   const { startDate, endDate, status } = req.query;

//   try {
//     const filter = {};

//     // If date range is provided, filter invoices within that range
//     if (startDate && endDate) {
//       filter.date = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate)
//       };
//     }

//     // If status is provided, filter by the selected status
//     if (status) {
//       filter.status = status;
//     }

//     // Group and count invoices by status
//     const invoiceStats = await Invoice.aggregate([
//       { $match: filter },
//       {
//         $group: {
//           _id: '$status',
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     res.status(200).json(invoiceStats);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });


// Get a single invoice by ID

router.get('/stats', async (req, res) => {
  const { startDate, endDate, status } = req.query;

  try {
    const filter = {};

    // Add date range filter if provided
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Add status filter if provided
    if (status) {
      filter.status = status;
    }

    // Get the full list of invoices that match the filter
    const invoices = await Invoice.find(filter).populate("customerId", "name").populate("loadId", "pickupLocation");

    // Group and count invoices by status
    const invoiceStats = await Invoice.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Return both invoices and stats in the response
    res.status(200).json({ invoices, invoiceStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const invoice = await Invoice.findById(id).populate({  path: 'customerId',
      select: 'name email phone'}).populate({path:'loadId', select:'pickupLocation loadId deliveryLocation vehicleId'});
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

// router.put('/invoices/:id', async (req, res) => {
//   try {
//       const { status } = req.body; // Status should be in the request body
//       const { id } = req.params; // ID of the document to update

//       const updatedInvoice = await Invoice.findByIdAndUpdate(
//           id, 
//           { status }, 
//           { new: true } // Return the updated document
//       ).populate('customerId','name').populate('loadId');

//       if (!updatedInvoice) {
//           return res.status(404).json({ message: 'Invoice not found' });
//       }

//       res.json(updatedInvoice);
//   } catch (error) {
//       console.error('Error updating invoice status:', error);
//       res.status(500).json({ message: 'Server error' });
//   }
// });

// Get invoice stats based on status and date range


module.exports = router;
