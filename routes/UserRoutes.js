const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
// const {registerValidation} = require('../validations.js');
const authenticateUser = require('../middlewares/verifyToken');

router.post('/',   async (req, res) => {
  const { email, name, password, role } = req.body;

  try {
        // Validation check
        // const {error} = registerValidation(req.body);
        // if(error) return res.status(400).send(error.details[0].message);
    
        // Email uniqueness check
        const emailExists = await User.findOne({email: req.body.email});
        if(emailExists) return res.status(400).send('Email address already exists');
    // Hash password and create user
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      role: role,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/',   async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id',   async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id',   async (req, res) => {
  const { id } = req.params;
  const { email, name, password, role } = req.body;

  try {
    const updatedData = { email, name, role };
    if (password) {
      updatedData.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id',   async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
