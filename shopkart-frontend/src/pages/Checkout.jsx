import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { cart, subtotal, fetchCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ fullName: '', phone: '', addressLine1: '', city: '', state: '', pincode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.state || !address.pincode) {
      return 'All shipping fields are required.';
    }
    if (!/^\d{10}$/.test(address.phone.trim())) {
      return 'Please enter a valid 10-digit phone number.';
    }
    if (!/^\d{6}$/.test(address.pincode.trim())) {
      return 'Please enter a valid 6-digit pincode.';
    }
    return null;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setError('Failed to load Razorpay SDK. Please check your internet connection.');
        setLoading(false);
        return;
      }

      const res = await api.post('/orders/create-payment-order', { shippingAddress: address });
      const { shopKartOrderId, razorpayOrderId, amount, currency, key } = res.data;

      const options = {
        key,
        amount,
        currency,
        name: 'ShopKart 🛒',
        description: 'Order Payment',
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            await api.post('/orders/verify-payment', {
              shopKartOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            await fetchCart();
            navigate('/orders');
          } catch (verifyErr) {
            setError(verifyErr.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: address.fullName,
          contact: address.phone
        },
        theme: { color: '#0284c7' }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        setError(`Payment Failed: ${response.error.description}`);
      });
      paymentObject.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize checkout');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={styles.empty}>
        <h2>Your cart is empty</h2>
        <button style={styles.button} onClick={() => navigate('/products')}>Shop Now</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>Checkout 💳</h2>
      {error && <div style={styles.errorBanner}>{error}</div>}
      <form onSubmit={handlePlaceOrder} style={styles.grid}>
        <div style={styles.formCard}>
          <h3>Shipping Address</h3>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={address.fullName}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={address.phone}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="text"
            name="addressLine1"
            placeholder="Address Line 1"
            value={address.addressLine1}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <div style={styles.row}>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={address.city}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={address.state}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={address.pincode}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <button type="submit" disabled={loading} style={styles.payBtn}>
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
        <div style={styles.summaryCard}>
          <h3>Order Review ({cart.length} items)</h3>
          <div style={styles.itemsList}>
            {cart.map(({ product, quantity }, index) => (
              <div key={index} style={styles.itemRow}>
                <span>{product.name} × {quantity}</span>
                <span>₹{(product.price * quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div style={styles.totalRow}>
            <span>Total Payable:</span>
            <span style={styles.totalAmount}>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1000px', margin: '0 auto' },
  empty: { textAlign: 'center', padding: '4rem' },
  errorBanner: { padding: '0.75rem', background: '#fef2f2', color: '#dc2626', borderRadius: '4px', marginBottom: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' },
  formCard: { background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  payBtn: { padding: '0.75rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' },
  summaryCard: { background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', height: 'fit-content' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '1rem' },
  itemRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' },
  totalRow: { display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', fontWeight: 'bold' },
  totalAmount: { color: '#0284c7', fontSize: '1.25rem' },
  button: { padding: '0.5rem 1rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default Checkout;