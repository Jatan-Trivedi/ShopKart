import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [wishlistState, setWishlistState] = useState('default');
  const [addingToCart, setAddingToCart] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddToWishlist = async () => {
    try {
      setWishlistState('saving');
      setErrorMessage('');
      await api.post(`/wishlist/${product._id}`);
      setWishlistState('saved');
    } catch (err) {
      if (err.response?.status === 409) {
        setWishlistState('saved');
      } else {
        setWishlistState('error');
        setErrorMessage(err.response?.data?.message || 'Failed to save');
      }
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    setErrorMessage('');
    const res = await addToCart(product._id);
    if (!res.success) {
      setErrorMessage(res.message);
    }
    setAddingToCart(false);
  };

  return (
    <div style={styles.card}>
      <img src={product.image} alt={product.name} style={styles.image} />
      <div style={styles.body}>
        <span style={styles.category}>{product.category}</span>
        <h3 style={styles.title}>{product.name}</h3>
        <p style={styles.price}>₹{product.price.toLocaleString('en-IN')}</p>
        
        <p style={product.stock > 0 ? styles.stock : styles.outOfStock}>
          {product.stock > 0 ? `${product.stock} units left` : 'Out of Stock'}
        </p>

        {errorMessage && <p style={styles.errorText}>{errorMessage}</p>}

        <button 
          onClick={handleAddToCart} 
          disabled={product.stock === 0 || addingToCart}
          style={styles.cartBtn}
        >
          {addingToCart ? 'Adding...' : 'Add to Cart 🛒'}
        </button>

        <div style={styles.actionGroup}>
          <Link to={`/products/${product._id}`} style={styles.detailsBtn}>
            View Details
          </Link>
          <button 
            onClick={handleAddToWishlist} 
            disabled={wishlistState === 'saving' || wishlistState === 'saved'}
            style={wishlistState === 'saved' ? styles.wishlistBtnSaved : styles.wishlistBtn}
          >
            {wishlistState === 'saving' ? '⏳...' : wishlistState === 'saved' ? '♥ Saved' : '♡ Wishlist'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: { border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', background: '#fff', display: 'flex', flexDirection: 'column' },
  image: { width: '100%', height: '180px', objectFit: 'cover' },
  body: { padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 },
  category: { fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' },
  title: { fontSize: '1.1rem', margin: 0, color: '#0f172a' },
  price: { fontSize: '1.25rem', fontWeight: 'bold', color: '#0284c7', margin: 0 },
  stock: { fontSize: '0.85rem', color: '#16a34a', margin: 0 },
  outOfStock: { fontSize: '0.85rem', color: '#dc2626', margin: 0 },
  errorText: { fontSize: '0.75rem', color: '#dc2626', margin: 0 },
  cartBtn: { padding: '0.5rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' },
  actionGroup: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' },
  detailsBtn: { textAlign: 'center', padding: '0.5rem', background: '#0284c7', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem' },
  wishlistBtn: { padding: '0.5rem', background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' },
  wishlistBtnSaved: { padding: '0.5rem', background: '#fce7f3', color: '#db2777', border: '1px solid #f472b6', borderRadius: '4px', fontWeight: 'bold', cursor: 'default', fontSize: '0.85rem' }
};

export default ProductCard;