import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/customers/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2>Create Account</h2>
        {error && <div style={styles.error}>{error}</div>}
        
        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required style={styles.input} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={styles.input} />
        <input type="password" name="password" placeholder="Password (min 6 chars)" value={formData.password} onChange={handleChange} required style={styles.input} />
        <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required style={styles.input} />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Creating...' : 'Register'}
        </button>

        <p style={styles.text}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' },
  card: { width: '350px', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', background: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' },
  button: { padding: '0.75rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  error: { color: '#dc2626', background: '#fef2f2', padding: '0.5rem', borderRadius: '4px', fontSize: '0.875rem' },
  text: { textAlign: 'center', fontSize: '0.875rem' }
};

export default Register;