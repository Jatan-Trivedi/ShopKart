import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data.orders);
    } catch (err) {
      setError('Unable to fetch your order history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div style={styles.status}>Loading your orders... 📦</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  if (orders.length === 0) {
    return (
      <div style={styles.status}>
        <h2>No orders placed yet 📦</h2>
        <p>Your completed purchases will appear here.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>My Order History ({orders.length})</h2>
      <div style={styles.ordersList}>
        {orders.map((order) => (
          <div key={order._id} style={styles.orderCard}>
            <div style={styles.header}>
              <div>
                <span style={styles.orderId}>Order #{order._id}</span>
                <span style={styles.date}>
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div>
                <span style={order.paymentStatus === 'PAID' ? styles.badgePaid : styles.badgePending}>
                  {order.status}
                </span>
              </div>
            </div>
            <div style={styles.itemsGrid}>
              {order.items.map((item, idx) => (
                <div key={idx} style={styles.itemRow}>
                  <img src={item.image} alt={item.name} style={styles.itemImg} />
                  <div>
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={styles.footer}>
              <span>Deliver To: {order.shippingAddress.fullName}, {order.shippingAddress.addressLine1}</span>
              <span style={styles.total}>Total: ₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1000px', margin: '0 auto' },
  status: { textAlign: 'center', padding: '4rem', fontSize: '1.2rem', color: '#64748b' },
  error: { textAlign: 'center', padding: '2rem', color: '#dc2626' },
  ordersList: { display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' },
  orderCard: { background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '1.5rem' },
  header: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1rem' },
  orderId: { fontWeight: 'bold', display: 'block' },
  date: { fontSize: '0.8rem', color: '#64748b' },
  badgePaid: { background: '#dcfce7', color: '#15803d', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem' },
  badgePending: { background: '#fef3c7', color: '#b45309', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem' },
  itemsGrid: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  itemRow: { display: 'flex', gap: '1rem', alignItems: 'center' },
  itemImg: { width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' },
  footer: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', marginTop: '1rem', fontSize: '0.9rem' },
  total: { fontWeight: 'bold', color: '#0284c7', fontSize: '1.1rem' }
};

export default Orders;