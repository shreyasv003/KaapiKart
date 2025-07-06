const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to check if user is admin
exports.isAdmin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user admin status and permissions
exports.updateUserAdminStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { adminRole, adminPermissions } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update admin role and permissions
    if (adminRole) {
      user.adminRole = adminRole;
      user.isAdmin = adminRole !== 'none';
    }

    if (adminPermissions) {
      user.adminPermissions = {
        ...user.adminPermissions,
        ...adminPermissions
      };
    }

    await user.save();
    res.json({ message: 'User admin status updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deactivate/Activate user
exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();
    
    res.json({ 
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get admin dashboard stats
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ isAdmin: true });
    
    res.json({
      totalUsers,
      activeUsers,
      adminUsers,
      lastUpdated: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 