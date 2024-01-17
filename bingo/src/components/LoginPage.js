// LoginPage.js
import React, { useState } from 'react';
import { Link ,useNavigate } from 'react-router-dom'; // Assuming you're using React Router

const LoginPage = () => {
  // State variables for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Function to handle login form submission
  const handleLogin = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Email:', email);
    console.log('Password:', password);
    // Reset the form fields after submission
    setEmail('');
    setPassword('');

    navigate('/chat');
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleLogin}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
    </div>
  );
};

export default LoginPage;
