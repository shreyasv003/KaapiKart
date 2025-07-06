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
  },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
