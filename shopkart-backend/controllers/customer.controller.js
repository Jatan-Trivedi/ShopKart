import bcrypt from 'bcrypt';
import Customer from '../models/customer.model.js';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';


export const registerCustomer = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'All fields are mandatory' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must contain at least 6 characters' });
    }

    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const customer = await Customer.create({
      fullName,
      email,
      password: hashedPassword,
      phone
    });

    return res.status(201).json({
      success: true,
      message: 'Customer registered successfully',
      customer: {
        _id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    generateTokenAndSetCookie(res, customer._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const getMyProfile = async (req, res) => {
  try {
    return res.status(200).json({
      _id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      phone: req.user.phone
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const logoutCustomer = async (req, res) => {
  try {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0)
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Old and new passwords are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must contain at least 6 characters' });
    }

    const customer = await Customer.findById(req.user._id);
    const isMatch = await bcrypt.compare(oldPassword, customer.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect old password' });
    }

    const salt = await bcrypt.genSalt(10);
    customer.password = await bcrypt.hash(newPassword, salt);
    await customer.save();

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};