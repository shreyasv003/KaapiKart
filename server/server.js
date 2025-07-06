// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const mongoose = require('mongoose');

// Debug environment variables
console.log('=== Environment Variables ===');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB
console.log('=== Database Connection ===');
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
    mongodb: {
      connected: mongoose.connection.readyState === 1,
      state: mongoose.connection.readyState
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT
    }
  };
  res.json(health);
});

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    // Test database connection
    const dbState = mongoose.connection.readyState;
    if (dbState !== 1) {
      throw new Error(`Database not connected. State: ${dbState}`);
    }

    // Test user creation
    const User = require('./models/User');
    const testUser = await User.create({
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'test123'
    });

    // Test user retrieval
    const foundUser = await User.findById(testUser._id);
    if (!foundUser) {
      throw new Error('Failed to retrieve test user');
    }

    // Clean up test user
    await User.deleteOne({ _id: testUser._id });

    res.json({
      status: 'success',
      message: 'Database connection and operations working correctly',
      details: {
        connectionState: dbState,
        testUserCreated: true,
        testUserRetrieved: true,
        testUserDeleted: true
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database test failed',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('=== Server Error ===');
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    name: err.name
  });
  
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5002;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('=== Unhandled Promise Rejection ===');
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    name: err.name
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('=== Uncaught Exception ===');
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    name: err.name
  });
  process.exit(1);
});
