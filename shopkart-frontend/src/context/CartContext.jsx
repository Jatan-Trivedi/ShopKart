import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children, user }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/cart');
      setCart(res.data.cart);
    } catch (err) {
      setError('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId) => {
    try {
      const res = await api.post(`/cart/${productId}`);
      setCart(res.data.cart);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to add item to cart'
      };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await api.patch(`/cart/${productId}`, { quantity });
      setCart(res.data.cart);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update quantity'
      };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete(`/cart/${productId}`);
      setCart(res.data.cart);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to remove item'
      };
    }
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        totalItems,
        subtotal,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);