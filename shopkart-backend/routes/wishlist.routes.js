import express from 'express';
import {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist
} from '../controllers/wishlist.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/:productId', protect, addToWishlist);
router.get('/', protect, getMyWishlist);
router.delete('/:productId', protect, removeFromWishlist);

export default router;