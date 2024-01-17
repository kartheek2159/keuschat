import React from 'react';
import BasicChat from "./components/BasicChat.js"
import Chat from "./components/Chat.js"
import RegistrationPage from './components/RegistrationPage.js';
import LoginPage from './components/LoginPage.js';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  return (
  <div className='App'>

<Router>
      <Routes>
      
        <Route path="/register" element={<RegistrationPage />} />

       
        <Route path="/login" element={<LoginPage />} />


        <Route path="/" element={<RegistrationPage />} />

        <Route path="/chat" element={<Chat />} />


      </Routes>
    </Router>


   
  </div>)
  
}

export default App;






