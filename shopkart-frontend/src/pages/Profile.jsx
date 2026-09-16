import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Customer Profile</h2>
      {user ? (
        <div style={{ lineHeight: '1.8' }}>
          <p><strong>Name:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Account ID:</strong> {user._id}</p>
        </div>
      ) : (
        <p>No user profile loaded.</p>
      )}
    </div>
  );
};

export default Profile;