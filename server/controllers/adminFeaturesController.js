const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Update admin dashboard settings
exports.updateAdminSettings = async (req, res) => {
  try {
    const { dashboardLayout, notificationPreferences, theme } = req.body;
    const user = await User.findById(req.user.id);

    user.adminSettings = {
      ...user.adminSettings,
      dashboardLayout: dashboardLayout || user.adminSettings.dashboardLayout,
      notificationPreferences: {
        ...user.adminSettings.notificationPreferences,
        ...notificationPreferences
      },
      theme: theme || user.adminSettings.theme
    };

    await user.save();
    res.json({ message: 'Admin settings updated successfully', settings: user.adminSettings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get admin activity log
exports.getAdminActivityLog = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      loginHistory: user.loginHistory,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bulk user management
exports.bulkUserManagement = async (req, res) => {
  try {
    const { action, userIds } = req.body;
    
    switch (action) {
      case 'activate':
        await User.updateMany(
          { _id: { $in: userIds } },
          { $set: { isActive: true } }
        );
        break;
      case 'deactivate':
        await User.updateMany(
          { _id: { $in: userIds } },
          { $set: { isActive: false } }
        );
        break;
      case 'delete':
        await User.deleteMany({ _id: { $in: userIds } });
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    res.json({ message: `Bulk action '${action}' completed successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get system health metrics
exports.getSystemHealth = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ isAdmin: true });
    const recentLogins = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    res.json({
      metrics: {
        totalUsers,
        activeUsers,
        adminUsers,
        recentLogins
      },
      systemStatus: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update admin permissions in bulk
exports.updateBulkPermissions = async (req, res) => {
  try {
    const { userIds, permissions } = req.body;
    
    await User.updateMany(
      { _id: { $in: userIds } },
      { $set: { adminPermissions: permissions } }
    );

    res.json({ message: 'Bulk permissions updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 