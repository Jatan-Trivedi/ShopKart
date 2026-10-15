import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login = ({ fetchUser }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      await api.post('/customers/login', formData);
      await fetchUser();
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2>Sign In</h2>
        {error && <div style={styles.error}>{error}</div>}

        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={styles.input} />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={styles.input} />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <p style={styles.text}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' },
  card: { width: '350px', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', background: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' },
  button: { padding: '0.75rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  error: { color: '#dc2626', background: '#fef2f2', padding: '0.5rem', borderRadius: '4px', fontSize: '0.875rem' },
  text: { textAlign: 'center', fontSize: '0.875rem' }
};

export default Login;