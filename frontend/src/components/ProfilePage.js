// frontend/src/components/ProfilePage.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';

function ProfilePage() {
  const { token, user, API_URL, handleLogout } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(user); // Initialize with context user
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && !profileData) { // Fetch if not already set by context or if you want fresh data
      setLoading(true);
      axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setProfileData(response.data.user);
        setError('');
      })
      .catch(err => {
        console.error("Profile fetch error:", err);
        setError(err.response?.data?.message || 'Failed to fetch profile. You might be logged out.');
        if (err.response?.status === 401) { // Unauthorized
            handleLogout(); // Log out if token is invalid
        }
      })
      .finally(() => {
        setLoading(false);
      });
    } else if (profileData) {
        setLoading(false);
    } else {
        setLoading(false); // No token, no profile data
    }
  }, [token, API_URL, profileData, handleLogout]); // Rerun if token or API_URL changes

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!profileData) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div>
      <h2>Your Profile</h2>
      <p><strong>Username:</strong> {profileData.username}</p>
      <p><strong>Email:</strong> {profileData.email}</p>
      <p><strong>Member Since:</strong> {new Date(profileData.created_at).toLocaleDateString()}</p>
    </div>
  );
}

export default ProfilePage;