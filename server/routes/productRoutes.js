const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
  try {
    console.log('GET /products - Request received');
    console.log('Fetching all products from database...');
    const products = await Product.find({});
    console.log('Number of products found:', products.length);
    console.log('Products:', JSON.stringify(products, null, 2));
    console.log('Sending response with products');
    res.json(products);
  } catch (err) {
    console.error('Error in GET /products:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ message: err.message });
  }
});

// Admin routes
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
 