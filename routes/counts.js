const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Customer = require('../models/Customer');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const Load = require('../models/Load');
const Invoice = require('../models/Invoice');


router.get('/', async (req, res) => {
    try {
    const counts = await Promise.all([
        User.countDocuments(),
        Customer.countDocuments(),
        Driver.countDocuments(),
        Vehicle.countDocuments(),
        Load.countDocuments(),
        Invoice.countDocuments(),
      ]);

      const result = {
          user: counts[0],
          customer: counts[1],
          driver: counts[2],
          vehicle: counts[3],
          load: counts[4],
          invoice: counts[5],

      };

      res.status(200).json({ result });
    } catch (error) {
      console.error('Error counting:', error);
      res.status(500).json({ error: 'Failed to count communication logs' });
    }
  });


  module.exports = router;