// RegistrationPage.js
import React, { useState } from 'react';
import { Link , useNavigate} from 'react-router-dom'; // Assuming you're using React Router

const RegistrationPage = () => {
  // State variables for username, email, and password
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Function to handle registration form submission
  const handleRegistration = (e) => {
    e.preventDefault();
    // Add your registration logic here
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
    // Reset the form fields after submission
    setUsername('');
    setEmail('');
    setPassword('');

    navigate('/chat');
  };

  return (
    <div>
      <h1>Registration Page</h1>
      <form onSubmit={handleRegistration}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
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
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
};

export default RegistrationPage;
