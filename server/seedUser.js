const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Set environment variables
process.env.JWT_SECRET = 'kaapikart-secret-key-2024';
process.env.MONGODB_URI = 'mongodb+srv://admin:Pekkacoc3113@cluster0.yuqceh9.mongodb.net/kaapikart?retryWrites=true&w=majority&appName=Cluster0';

const seedUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create test user
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      isAdmin: false
    };

    // Check if user exists
    const userExists = await User.findOne({ email: testUser.email });
    if (userExists) {
      console.log('Test user already exists');
      process.exit(0);
    }

    // Create user
    const user = await User.create(testUser);
    console.log('Test user created:', { name: user.name, email: user.email });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding user:', error);
    process.exit(1);
  }
};

seedUser(); 