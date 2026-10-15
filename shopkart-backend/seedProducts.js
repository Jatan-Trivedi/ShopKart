import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/product.model.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'Noise Cancelling Headphones',
    description: 'Wireless over-ear headphones with active noise cancellation and 30-hour battery life.',
    price: 4999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    stock: 25
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit tactile mechanical keyboard with customizable macros.',
    price: 2999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    stock: 12
  },
  {
    name: 'Classic Denim Jacket',
    description: '100% Cotton durable denim jacket with vintage wash.',
    price: 1999,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500',
    stock: 8
  },
  {
    name: 'Clean Code Book',
    description: 'A Handbook of Agile Software Craftsmanship by Robert C. Martin.',
    price: 899,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
    stock: 15
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log('Database seeded with sample products!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDB();