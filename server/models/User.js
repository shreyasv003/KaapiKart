const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  adminRole: { 
    type: String, 
    enum: ['none', 'super_admin', 'content_admin', 'order_admin', 'support_admin'],
    default: 'none'
  },
  adminPermissions: {
    canManageUsers: { type: Boolean, default: false },
    canManageProducts: { type: Boolean, default: false },
    canManageOrders: { type: Boolean, default: false },
    canViewAnalytics: { type: Boolean, default: false },
    canManageDiscounts: { type: Boolean, default: false },
    canManageInventory: { type: Boolean, default: false },
    canManageSupport: { type: Boolean, default: false },
    canManageSettings: { type: Boolean, default: false }
  },
  adminSettings: {
    dashboardLayout: { type: String, default: 'default' },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    theme: { type: String, default: 'light' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  isActive: { type: Boolean, default: true },
  loginHistory: [{
    timestamp: Date,
    ip: String
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to update last login
userSchema.methods.updateLastLogin = async function(ip) {
  this.lastLogin = new Date();
  this.loginHistory.push({
    timestamp: new Date(),
    ip: ip
  });
  // Keep only last 10 logins
  if (this.loginHistory.length > 10) {
    this.loginHistory = this.loginHistory.slice(-10);
  }
  return this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
