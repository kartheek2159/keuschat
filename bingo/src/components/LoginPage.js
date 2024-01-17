
import React, { useState } from 'react';
import { Link ,useNavigate } from 'react-router-dom'; 
import axios from 'axios';

const LoginPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

 
  const handleLogin = (e) => {
    e.preventDefault();
    
    console.log('username:', email);
    console.log('Password:', password);

    setEmail('');
    setPassword('');
    axios.post('http://localhost:7000/auth/login',{
      username:email,
      password:password,
    }).then((res)=>{
      console.log(res.data)
      localStorage.setItem('userData', JSON.stringify(res.data));
      navigate('/chat')
    }).catch((err)=>{
      console.log(err)
    
    })   
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleLogin}>
        <label>
          username:
          <input
            type="text"
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
