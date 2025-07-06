const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) res.json(product);
  else res.status(404).json({ message: 'Product not found' });
};

exports.createProduct = async (req, res) => {
  const { name, description, price, image } = req.body;
  const newProduct = new Product({ name, description, price, image });
  await newProduct.save();
  res.status(201).json(newProduct);
};

exports.updateProduct = async (req, res) => {
  const { name, description, price, image } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  product.name = name;
  product.description = description;
  product.price = price;
  product.image = image;

  await product.save();
  res.json(product);
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  await product.remove();
  res.json({ message: 'Product removed' });
};
