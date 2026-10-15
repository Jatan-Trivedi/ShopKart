import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div style={styles.status}>Loading product details...</div>;
  if (error) return <div style={styles.error}>{error}</div>;
  if (!product) return null;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
      <div style={styles.detailsGrid}>
        <img src={product.image} alt={product.name} style={styles.image} />
        <div style={styles.info}>
          <span style={styles.category}>{product.category}</span>
          <h1>{product.name}</h1>
          <p style={styles.price}>₹{product.price.toLocaleString('en-IN')}</p>
          <p style={styles.description}>{product.description}</p>
          <p style={styles.stock}>Availability: <strong>{product.stock} units in stock</strong></p>
          
          <button style={styles.cartBtn} disabled={product.stock === 0}>
            {product.stock > 0 ? 'Add to Cart 🛒' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1000px', margin: '0 auto' },
  backBtn: { padding: '0.5rem 1rem', background: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '1.5rem' },
  detailsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', background: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #e2e8f0' },
  image: { width: '100%', height: '350px', objectFit: 'cover', borderRadius: '8px' },
  info: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  category: { color: '#64748b', fontSize: '0.875rem', textTransform: 'uppercase', fontWeight: 'bold' },
  price: { fontSize: '2rem', color: '#0284c7', fontWeight: 'bold', margin: 0 },
  description: { lineHeight: '1.6', color: '#334155' },
  stock: { color: '#475569' },
  cartBtn: { padding: '0.75rem 1.5rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' },
  status: { textAlign: 'center', padding: '3rem', fontSize: '1.2rem' },
  error: { textAlign: 'center', padding: '1rem', background: '#fef2f2', color: '#dc2626', borderRadius: '4px', margin: '2rem' }
};

export default ProductDetails;