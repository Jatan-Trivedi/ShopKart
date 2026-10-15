import React from 'react';

const Home = ({ user }) => {
  if (!user) return null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Welcome back, {user.fullName}! 👋</h2>
        <div style={styles.infoGroup}>
          <p><strong>Customer ID:</strong> {user._id}</p>
          <p><strong>Email Address:</strong> {user.email}</p>
          <p><strong>Phone Number:</strong> {user.phone}</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', display: 'flex', justifyContent: 'center' },
  card: { width: '100%', maxWidth: '500px', padding: '2rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0' },
  infoGroup: { marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }
};

export default Home;