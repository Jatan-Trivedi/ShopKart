import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must contain at least 6 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
        min: [1, 'Quantity cannot be less than 1']
      }
    }
  ]
}, {
  timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;