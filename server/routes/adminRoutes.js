const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  isAdmin,
  getAllUsers,
  updateUserAdminStatus,
  toggleUserStatus,
  getAdminStats
} = require('../controllers/adminController');
const {
  updateAdminSettings,
  getAdminActivityLog,
  bulkUserManagement,
  getSystemHealth,
  updateBulkPermissions
} = require('../controllers/adminFeaturesController');

// All routes are protected and require admin access
router.use(protect);
router.use(isAdmin);

// Admin dashboard routes
router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:userId/admin-status', updateUserAdminStatus);
router.put('/users/:userId/toggle-status', toggleUserStatus);

// Special admin features
router.put('/settings', updateAdminSettings);
router.get('/activity-log', getAdminActivityLog);
router.post('/bulk-users', bulkUserManagement);
router.get('/system-health', getSystemHealth);
router.put('/bulk-permissions', updateBulkPermissions);

module.exports = router; 