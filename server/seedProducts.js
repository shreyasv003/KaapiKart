const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

// Set environment variables directly
process.env.MONGODB_URI = 'mongodb+srv://admin:Pekkacoc3113@cluster0.yuqceh9.mongodb.net/kaapikart?retryWrites=true&w=majority&appName=Cluster0';
process.env.PORT = '5000';
process.env.JWT_SECRET = 'kaapikart-secret-key-2024';

dotenv.config();

const products = [
  {
    name: 'Espresso',
    description: 'Strong and concentrated coffee served in a small cup',
    price: 60,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'Hot'
  },
  {
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and foam',
    price: 80,
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Hot'
  },
  {
    name: 'Latte',
    description: 'Espresso with steamed milk and a light layer of foam',
    price: 90,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'Hot'
  },
  {
    name: 'Iced Coffee',
    description: 'Chilled coffee served with ice',
    price: 70,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'Cold'
  },
  {
    name: 'Cold Brew',
    description: 'Coffee brewed with cold water for 12-24 hours',
    price: 100,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'Cold'
  },
  {
    name: 'Mocha',
    description: 'Espresso with chocolate and steamed milk',
    price: 95,
    image: 'https://images.pexels.com/photos/312080/pexels-photo-312080.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Hot'
  }
];

const seedProducts = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Add new products
    await Product.insertMany(products);
    console.log('Added sample products');

    process.exit();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts(); 