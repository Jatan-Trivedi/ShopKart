import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const handleLogout = async () => {
    try {
      await api.post('/customers/logout');
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <nav style={styles.nav}>
      <RouterLink to="/products" style={styles.logoLink}>ShopKart 🛒</RouterLink>
      <div style={styles.links}>
        <RouterLink to="/products" style={styles.link}>Products</RouterLink>
        {user ? (
          <>
            <RouterLink to="/wishlist" style={styles.link}>Wishlist</RouterLink>
            <RouterLink to="/cart" style={styles.link}>
              Cart {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
            </RouterLink>
            <RouterLink to="/orders" style={styles.link}>Orders</RouterLink>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <RouterLink to="/login" style={styles.link}>Login</RouterLink>
            <RouterLink to="/register" style={styles.link}>Register</RouterLink>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: '#1e293b',
    color: '#fff'
  },
  logoLink: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#38bdf8',
    textDecoration: 'none'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem'
  },
  badge: {
    background: '#ef4444',
    color: '#fff',
    borderRadius: '50%',
    padding: '0.1rem 0.4rem',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    marginLeft: '0.25rem'
  },
  logoutBtn: {
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default Navbar;