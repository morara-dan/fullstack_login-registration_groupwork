import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../App';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { API_URL } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("PASSCODES DO NOT MATCH");
      return;
    }
    if (password.length < 6) {
      setError("PASSCODE REQUIRES 6+ CHARACTERS");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/register`, {
        username,
        email,
        password,
      });
      setSuccess(response.data.message + " REDIRECTING TO LOGIN...");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>CREDENTIALS REGISTRATION</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="USERNAME"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="REGISTER EMAIL"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="SET PASSCODE"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="CONFIRM PASSCODE"
          required
        />
        <button type="submit">REGISTER</button>
      </form>
      <div className="alternate-action">
        Already have credentials? <Link to="/login">Proceed to Login.</Link>
      </div>
    </div>
  );
}

export default RegisterPage;