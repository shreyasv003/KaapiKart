const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      price: Number,
    },
  ],
  total: Number,
  paymentMethod: { type: String, enum: ['card', 'upi', 'cod'], default: 'cod' },
  paymentDetails: {
    cardNumber: String,
    cardHolder: String,
    transactionId: String,
    gateway: String,
    upiId: String,
    status: String,
    error: String
  },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  orderStatus: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
