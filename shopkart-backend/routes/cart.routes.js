import express from 'express';
import {
  addToCart,
  getMyCart,
  updateCartQuantity,
  removeFromCart
} from '../controllers/cart.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/:productId', protect, addToCart);
router.get('/', protect, getMyCart);
router.patch('/:productId', protect, updateCartQuantity);
router.delete('/:productId', protect, removeFromCart);

export default router;