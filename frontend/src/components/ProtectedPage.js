// frontend/src/components/ProtectedPage.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';

function ProtectedPage() {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { token, API_URL, handleLogout } = useContext(AuthContext);

    useEffect(() => {
        if (token) {
            axios.get(`${API_URL}/protected`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setMessage(response.data.message);
                setError('');
            })
            .catch(err => {
                console.error("Protected route error:", err);
                setError(err.response?.data?.message || 'Access denied or error fetching data.');
                if (err.response?.status === 401) {
                    handleLogout();
                }
            });
        }
    }, [token, API_URL, handleLogout]);

    if (error) {
        return <p style={{ color: 'red' }}>Error: {error}</p>;
    }

    return (
        <div>
            <h2>Protected Content</h2>
            {message ? <p>{message}</p> : <p>Loading protected content...</p>}
        </div>
    );
}

export default ProtectedPage;