import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './chatApp.css'

const ChatApp = () => {
  const [usersData, setUsersData] = useState([]);
  const [ud, setUd] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messagesData, setMessagesData] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const sud = localStorage.getItem('userData');
    if (sud) {
      const parseud = JSON.parse(sud);
      setUd(parseud);
      console.log(parseud['user']['email']);
    } else {
      navigate('/login');
    }

    // Fetch users data from the API
    axios.get('http://localhost:7000/user')
      .then((response) => {
        setUsersData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });

  }, [navigate]);

  const handleUserClick = (userId) => {
    console.log(userId)
    setSelectedUserId(userId);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') {
      return; // Don't send empty messages
    }

    const updatedMessages = { ...messagesData };
    const newMessageObject = {
      id: Date.now(), // Using timestamp as a unique ID for simplicity
      text: newMessage,
    };

    if (selectedUserId in updatedMessages) {
      updatedMessages[selectedUserId] = [
        ...updatedMessages[selectedUserId],
        newMessageObject,
      ];
    } else {
      updatedMessages[selectedUserId] = [newMessageObject];
    }

    setMessagesData(updatedMessages);
    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <div className="user-list">
        <h2>User List</h2>
        <h2>Current user name {ud ? ud['user']['username'] : ''}</h2>
        <ul>
          {usersData.map((user) => (
            <li key={user._id} onClick={() => handleUserClick(user._id)}>
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      <div className="message-section">
        <h2>Messages</h2>
        {selectedUserId ? (
          <div>
            <ul>
              {messagesData[selectedUserId]?.map((message) => (
                <li key={message.id}>{message.text}</li>
              ))}
            </ul>
            <div className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        ) : (
          <p>Select a user to view messages.</p>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
