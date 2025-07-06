const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;

// Connect to the in-memory database before running tests
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

// Clear all data between tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

// Disconnect and stop mongod after all tests
afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

// Mock environment variables for testing
process.env.JWT_SECRET = 'test-secret-key';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.PORT = 5000;

// Global test utilities
global.testUtils = {
  // Create a test user
  createTestUser: async (User, userData = {}) => {
    const defaultUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '1234567890',
      address: 'Test Address',
      ...userData
    };
    
    const user = new User(defaultUser);
    return await user.save();
  },

  // Create a test product
  createTestProduct: async (Product, productData = {}) => {
    const defaultProduct = {
      name: 'Test Coffee',
      description: 'A delicious test coffee',
      price: 150,
      category: 'Hot Coffee',
      image: 'test-image.jpg',
      available: true,
      ...productData
    };
    
    const product = new Product(defaultProduct);
    return await product.save();
  },

  // Create a test order
  createTestOrder: async (Order, orderData = {}) => {
    const defaultOrder = {
      user: orderData.user || '507f1f77bcf86cd799439011',
      items: [
        {
          product: '507f1f77bcf86cd799439012',
          quantity: 2,
          price: 150
        }
      ],
      totalAmount: 300,
      status: 'pending',
      paymentMethod: 'card',
      ...orderData
    };
    
    const order = new Order(defaultOrder);
    return await order.save();
  },

  // Generate JWT token for testing
  generateTestToken: (userId, isAdmin = false) => {
    const jwt = require('jsonwebtoken');
    return jwt.sign(
      { userId, isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  }
}; 