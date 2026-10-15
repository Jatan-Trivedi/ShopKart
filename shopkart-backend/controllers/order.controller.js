import crypto from 'crypto';
import Order from '../models/order.model.js';
import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';
import razorpay from '../config/razorpay.js';

export const createPaymentOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const customerId = req.user._id;

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'All shipping address fields are required' });
    }

    const customer = await Customer.findById(customerId).populate('cart.product');
    if (!customer.cart || customer.cart.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    const orderItems = [];
    let serverTotal = 0;

    for (const cartItem of customer.cart) {
      const product = await Product.findById(cartItem.product._id);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product no longer exists: ${cartItem.product._id}` });
      }
      if (cartItem.quantity > product.stock) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
      }
      serverTotal += product.price * cartItem.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        image: product.image
      });
    }

    const shopKartOrder = await Order.create({
      user: customerId,
      items: orderItems,
      shippingAddress,
      totalAmount: serverTotal,
      paymentStatus: 'PENDING',
      status: 'PENDING_PAYMENT'
    });

    const amountInPaise = Math.round(serverTotal * 100);
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: shopKartOrder._id.toString()
    });

    shopKartOrder.razorpayOrderId = razorpayOrder.id;
    await shopKartOrder.save();

    return res.status(201).json({
      success: true,
      shopKartOrderId: shopKartOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!shopKartOrderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification parameters' });
    }

    const order = await Order.findById(shopKartOrderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to order' });
    }

    const body = order.razorpayOrderId + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = 'FAILED';
      await order.save();
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    order.paymentStatus = 'PAID';
    order.status = 'PLACED';
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    const customer = await Customer.findById(req.user._id);
    customer.cart = [];
    await customer.save();

    return res.status(200).json({
      success: true,
      message: 'Payment verified and order confirmed',
      order
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to order' });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Invalid order ID' });
  }
};