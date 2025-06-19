// frontend/src/App.js

import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './App.css';

// Components
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import ProtectedPage from './components/ProtectedPage';

const API_URL = 'http://localhost:5001/api';

export const AuthContext = createContext();

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        if (decoded.exp * 1000 < Date.now()) {
           console.log("Token expired on client side.");
           handleLogout();
           setLoading(false);
           return;
        }

        setToken(storedToken);
        axios.get(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        })
        .then(response => {
          setUser(response.data.user);
        })
        .catch(error => {
          console.error("Error fetching profile on load:", error);
          handleLogout();
        })
        .finally(() => setLoading(false));
      } catch (error) {
        console.error("Invalid token in local storage:", error);
        handleLogout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="App">
          <div className="loading-container auth-container" style={{textAlign: 'center', padding: '60px'}}>
              <h2>LOADING...</h2> {/* Reverted loading text too for consistency */}
          </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ token, user, handleLogin, handleLogout, API_URL }}>
      <Router>
        <div className="App">
          {token && (
            <nav>
              <ul className="main-nav">
                {/* Reverted Navigation Labels */}
                <li><Link to="/">Home</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/protected">Protected</Link></li>
                {/* Reverted Logout Button Text */}
                <li><button onClick={handleLogout}>Logout ({user?.username || 'User'})</button></li>
              </ul>
            </nav>
          )}

          <Routes>
            <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/profile" />} />
            <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to="/profile" />} />

            <Route element={<ProtectedRoute token={token} />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/protected" element={<ProtectedPage />} />
            </Route>

            <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

const ProtectedRoute = ({ token }) => {
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default App;