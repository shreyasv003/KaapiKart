const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  const { items, total, paymentMethod, paymentDetails } = req.body;
  try {
    console.log('Creating order for user:', req.user.id);
    console.log('Order data:', { items, total, paymentMethod, paymentDetails });

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid order items' });
    }

    if (!total || typeof total !== 'number') {
      return res.status(400).json({ message: 'Invalid order total' });
    }

    if (!paymentMethod || !['card', 'upi', 'cod'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    const newOrder = new Order({
      user: req.user.id,
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price
      })),
      total,
      paymentMethod,
      paymentDetails: paymentDetails || null,
      isPaid: paymentMethod === 'cod' ? false : true, // COD orders are not paid initially
      paidAt: paymentMethod === 'cod' ? null : new Date(),
    });

    console.log('Saving order:', newOrder);
    await newOrder.save();
    console.log('Order saved successfully');
    
    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate('items.product');
  res.json(orders);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user').populate('items.product');
  res.json(orders);
};
