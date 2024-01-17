// RegistrationPage.js
import React, { useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios';

const RegistrationPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  
  const handleRegistration = (e) => {
    e.preventDefault();
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);

    setUsername('');
    setEmail('');
    setPassword('');
    axios.post('http://localhost:7000/auth/register',{
      username:username,
      email:email,
      password:password,
    }).then((res)=>{
      console.log(res.data)
      navigate('/chat')
    }).catch((err)=>{
      console.log(err)
    })

   
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
