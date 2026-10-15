import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import api from './services/api';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import { CartProvider } from './context/CartContext';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get('/customers/me');
      setUser(res.data.customer || res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading ShopKart...</div>;
  }

  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/products" />} />
          <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/products" />} />
          <Route path="/wishlist" element={user ? <Wishlist /> : <Navigate to="/login" />} />
          <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
          <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
          <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;