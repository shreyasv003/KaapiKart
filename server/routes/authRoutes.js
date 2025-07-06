const express = require('express');
const router = express.Router();
const { register, login, updateAdminStatus } = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/verifyToken', protect, (req, res) => {
  res.json({ user: req.user });
});

// Admin routes
router.post('/update-admin', protect, admin, updateAdminStatus);
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Direct admin update route
router.post('/make-admin', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isAdmin = true;
    await user.save();
    
    console.log('Updated user to admin:', { email: user.email, isAdmin: user.isAdmin });
    
    res.json({ message: 'User updated to admin successfully', user });
  } catch (err) {
    console.error('Error updating user to admin:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create admin user
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: true
    });
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
