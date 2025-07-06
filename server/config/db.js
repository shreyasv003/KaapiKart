const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Log connection attempt (masking sensitive info)
    const maskedUri = process.env.MONGODB_URI.replace(
      /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/,
      'mongodb$1://$2:****@'
    );
    console.log('Attempting to connect to MongoDB Atlas...');
    console.log('Connection URI:', maskedUri);

    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      ssl: true,
      authSource: 'admin',
      retryWrites: true,
      w: 'majority'
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log('MongoDB Atlas Connected Successfully');
    console.log('Connection State:', mongoose.connection.readyState);
    console.log('Database Name:', conn.connection.name);

    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB Atlas');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB Atlas');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('Mongoose connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error during mongoose connection closure:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('=== MongoDB Connection Error ===');
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code
    });
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB Atlas. Please check:');
      console.error('1. Your internet connection');
      console.error('2. MongoDB Atlas cluster status');
      console.error('3. IP whitelist settings in MongoDB Atlas');
      console.error('4. Database user credentials');
    }
    
    // Don't throw the error, let the application handle it
    console.error('Connection failed, but continuing...');
  }
};

module.exports = connectDB;
