import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const customerId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < 1) {
      return res.status(400).json({ success: false, message: 'Product is out of stock' });
    }

    const customer = await Customer.findById(customerId);
    const existingIndex = customer.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingIndex > -1) {
      const newQuantity = customer.cart[existingIndex].quantity + 1;
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more units. Available stock is ${product.stock}`
        });
      }
      customer.cart[existingIndex].quantity = newQuantity;
    } else {
      customer.cart.push({ product: productId, quantity: 1 });
    }

    await customer.save();

    const updatedCustomer = await Customer.findById(customerId).populate({
      path: 'cart.product',
      select: 'name price category image stock'
    });

    return res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      cart: updatedCustomer.cart
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Invalid product request' });
  }
};

export const getMyCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate({
      path: 'cart.product',
      select: 'name price category image stock'
    });

    return res.status(200).json({
      success: true,
      cart: customer.cart
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be a number equal to at least 1' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity exceeds available stock (${product.stock})`
      });
    }

    const customer = await Customer.findById(req.user._id);
    const itemIndex = customer.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not found in cart' });
    }

    customer.cart[itemIndex].quantity = quantity;
    await customer.save();

    const updatedCustomer = await Customer.findById(req.user._id).populate({
      path: 'cart.product',
      select: 'name price category image stock'
    });

    return res.status(200).json({
      success: true,
      message: 'Quantity updated',
      cart: updatedCustomer.cart
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const customer = await Customer.findById(req.user._id);

    customer.cart = customer.cart.filter(
      (item) => item.product.toString() !== productId
    );
    await customer.save();

    const updatedCustomer = await Customer.findById(req.user._id).populate({
      path: 'cart.product',
      select: 'name price category image stock'
    });

    return res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      cart: updatedCustomer.cart
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};