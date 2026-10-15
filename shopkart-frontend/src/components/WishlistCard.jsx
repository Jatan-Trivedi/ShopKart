import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const WishlistCard = ({ product, onRemove }) => {
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    await onRemove(product._id);
  };

  return (
    <div style={styles.card}>
      <img src={product.image} alt={product.name} style={styles.image} />
      <div style={styles.body}>
        <span style={styles.category}>{product.category}</span>
        <h3 style={styles.title}>{product.name}</h3>
        <p style={styles.price}>₹{product.price.toLocaleString('en-IN')}</p>

        <div style={styles.actionGroup}>
          <Link to={`/products/${product._id}`} style={styles.viewBtn}>
            View Details
          </Link>
          <button onClick={handleRemove} disabled={removing} style={styles.removeBtn}>
            {removing ? 'Removing...' : 'Remove ♥'}
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
  actionGroup: { marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.5rem' },
  viewBtn: { textAlign: 'center', padding: '0.5rem', background: '#0284c7', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.875rem' },
  removeBtn: { padding: '0.5rem', background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.875rem' }
};

export default WishlistCard;