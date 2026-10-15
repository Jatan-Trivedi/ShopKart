import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import WishlistCard from '../components/WishlistCard';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/wishlist');
      setWishlist(res.data.wishlist);
    } catch (err) {
      setError('Unable to load your wishlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemoveItem = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      alert('Failed to remove item from wishlist.');
    }
  };

  if (loading) {
    return <div style={styles.status}>Loading your wishlist... ❤️</div>;
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p>{error}</p>
        <button onClick={fetchWishlist} style={styles.retryBtn}>Try Again</button>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❤️</div>
        <h2>Your wishlist is empty</h2>
        <p style={{ color: '#64748b' }}>Save products you love and find them here later.</p>
        <Link to="/products" style={styles.browseBtn}>Browse Products</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>My Wishlist ({wishlist.length})</h2>
      <div style={styles.grid}>
        {wishlist.map((product) => (
          <WishlistCard 
            key={product._id} 
            product={product} 
            onRemove={handleRemoveItem} 
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' },
  status: { textAlign: 'center', padding: '4rem', fontSize: '1.2rem', color: '#64748b' },
  emptyContainer: { textAlign: 'center', padding: '5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' },
  browseBtn: { marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#0284c7', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' },
  errorContainer: { textAlign: 'center', padding: '4rem', color: '#dc2626' },
  retryBtn: { padding: '0.5rem 1rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem' }
};

export default Wishlist;