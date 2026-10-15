import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, loading, error, subtotal, totalItems, updateQuantity, removeFromCart, fetchCart } = useCart();
  const [updatingId, setUpdatingId] = useState(null);
  const [actionError, setActionError] = useState('');
  const navigate = useNavigate();

  const handleQtyChange = async (productId, currentQty, delta, stock) => {
    setActionError('');
    const newQty = currentQty + delta;
    if (newQty < 1 || newQty > stock) return;

    setUpdatingId(productId);
    const res = await updateQuantity(productId, newQty);
    if (!res.success) {
      setActionError(res.message);
    }
    setUpdatingId(null);
  };

  const handleRemove = async (productId) => {
    setActionError('');
    setUpdatingId(productId);
    const res = await removeFromCart(productId);
    if (!res.success) {
      setActionError(res.message);
    }
    setUpdatingId(null);
  };

  if (loading && cart.length === 0) {
    return <div style={styles.status}>Loading your shopping cart... 🛒</div>;
  }

  if (error) {
    return (
      <div style={styles.status}>
        <p style={{ color: '#dc2626' }}>{error}</p>
        <button onClick={fetchCart} style={styles.retryBtn}>Try Again</button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
        <h2>Your cart is empty</h2>
        <p style={{ color: '#64748b' }}>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" style={styles.browseBtn}>Browse Products</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>Shopping Cart ({totalItems} items)</h2>

      {actionError && <div style={styles.errorBanner}>{actionError}</div>}

      <div style={styles.cartGrid}>
        <div style={styles.itemList}>
          {cart.map(({ product, quantity }) => {
            if (!product) return null;
            const rowSubtotal = product.price * quantity;

            return (
              <div key={product._id} style={styles.itemRow}>
                <img src={product.image} alt={product.name} style={styles.itemImage} />
                <div style={styles.itemDetails}>
                  <h3>{product.name}</h3>
                  <span style={styles.category}>{product.category}</span>
                  <p style={styles.price}>₹{product.price.toLocaleString('en-IN')}</p>
                </div>

                <div style={styles.qtyContainer}>
                  <div style={styles.qtyBox}>
                    <button
                      onClick={() => handleQtyChange(product._id, quantity, -1, product.stock)}
                      disabled={quantity <= 1 || updatingId === product._id}
                      style={styles.qtyBtn}
                    >
                      -
                    </button>
                    <span style={styles.qtyText}>{quantity}</span>
                    <button
                      onClick={() => handleQtyChange(product._id, quantity, 1, product.stock)}
                      disabled={quantity >= product.stock || updatingId === product._id}
                      style={styles.qtyBtn}
                    >
                      +
                    </button>
                  </div>
                  <span style={styles.stockNote}>Max: {product.stock}</span>
                </div>

                <div style={styles.subtotalBox}>
                  <p style={styles.rowSubtotal}>₹{rowSubtotal.toLocaleString('en-IN')}</p>
                  <button
                    onClick={() => handleRemove(product._id)}
                    disabled={updatingId === product._id}
                    style={styles.removeBtn}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={styles.summaryCard}>
          <h3>Order Summary</h3>
          <div style={styles.summaryRow}>
            <span>Total Units:</span>
            <strong>{totalItems}</strong>
          </div>
          <div style={styles.summaryRow}>
            <span>Subtotal:</span>
            <strong style={styles.summarySubtotal}>₹{subtotal.toLocaleString('en-IN')}</strong>
          </div>
          <p style={styles.taxNote}>Taxes & shipping calculated at checkout.</p>
          <button 
            onClick={() => navigate('/checkout')} 
            style={styles.checkoutBtn}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  status: { textAlign: 'center', padding: '4rem', fontSize: '1.2rem', color: '#64748b' },
  emptyContainer: { textAlign: 'center', padding: '5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  browseBtn: { marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#0284c7', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' },
  errorBanner: { padding: '0.75rem', background: '#fef2f2', color: '#dc2626', borderRadius: '4px', marginBottom: '1rem' },
  cartGrid: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', marginTop: '1.5rem' },
  itemList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  itemRow: { display: 'grid', gridTemplateColumns: '80px 1fr 120px 120px', gap: '1rem', alignItems: 'center', background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' },
  itemImage: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' },
  itemDetails: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  category: { fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' },
  price: { color: '#0284c7', fontWeight: 'bold', margin: 0 },
  qtyContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' },
  qtyBox: { display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px' },
  qtyBtn: { width: '32px', height: '32px', background: '#f8fafc', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
  qtyText: { width: '32px', textAlign: 'center', fontWeight: 'bold' },
  stockNote: { fontSize: '0.7rem', color: '#94a3b8' },
  subtotalBox: { textAlign: 'right' },
  rowSubtotal: { fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a', margin: 0 },
  removeBtn: { background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem', marginTop: '0.5rem', textDecoration: 'underline' },
  summaryCard: { background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '1rem' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '1rem' },
  summarySubtotal: { color: '#0284c7', fontSize: '1.25rem' },
  taxNote: { fontSize: '0.8rem', color: '#64748b', margin: 0 },
  checkoutBtn: { padding: '0.75rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' },
  retryBtn: { marginTop: '1rem', padding: '0.5rem 1rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default Cart;