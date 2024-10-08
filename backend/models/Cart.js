const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
  product: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    default: 1 
  },
  pricePerKg: { 
    type: Number, 
    required: true 
  },
  vendorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Vendor', 
    required: true 
  },
});

const CartSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true 
  },
  items: [CartItemSchema],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
