import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const customerId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const customer = await Customer.findById(customerId);

    if (customer.wishlist.includes(productId)) {
      return res.status(409).json({ success: false, message: 'Product is already in your wishlist' });
    }

    customer.wishlist.push(productId);
    await customer.save();

    return res.status(200).json({
      success: true,
      message: 'Product added to wishlist successfully'
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Invalid Product ID format' });
  }
};

export const getMyWishlist = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate({
      path: 'wishlist',
      select: 'name price category image stock description'
    });

    return res.status(200).json({
      success: true,
      count: customer.wishlist.length,
      wishlist: customer.wishlist
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const customerId = req.user._id;

    const customer = await Customer.findById(customerId);

    if (!customer.wishlist.includes(productId)) {
      return res.status(404).json({ success: false, message: 'Product not found in your wishlist' });
    }

    customer.wishlist = customer.wishlist.filter(
      (id) => id.toString() !== productId
    );
    await customer.save();

    return res.status(200).json({
      success: true,
      message: 'Product removed from wishlist successfully'
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Invalid Product ID format' });
  }
};