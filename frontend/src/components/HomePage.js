// frontend/src/components/HomePage.js
import React, { useContext } from 'react';
import { AuthContext } from '../App';

function HomePage() {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <h1>Welcome to the Modern Auth App!</h1>
      {user ? (
        <p>You are logged in as {user.username}.</p>
      ) : (
        <p>Please log in or register to continue.</p>
      )}
    </div>
  );
}
export default HomePage;