import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StringCodec, connect } from 'nats.ws';
import axios from 'axios';
import './chatApp.css'

const ChatApp = () => {
  const [usersData, setUsersData] = useState([]);
  const [ud, setUd] = useState(null);

  const [currid,setCurrid]=useState('')
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [nc, setConnection] = useState(undefined);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const sc = StringCodec();

  const connectToNats = async (commonSubject) => {
    try {
      const natsConnection = await connect({
        servers: "http://localhost:9090",
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        },
      });
      setConnection(natsConnection);
      console.log(commonSubject)

      const subscription = natsConnection.subscribe(commonSubject, {
        callback: (err, msg) => {
          if (err) {
            console.error(err);
          } else {
            const messageObject = JSON.parse(sc.decode(msg.data));
            console.log("Received message:", messageObject);
            
            setReceivedMessages((prevMessages) => [...prevMessages, messageObject]);
            console.log(subscription);
          }
        },
      });
      
      
      console.log(subscription);

      return () => {
        if (nc) {
          // Unsubscribe and handle the promise resolution
          nc.unsubscribe().then(() => {
            console.log("Unsubscribed successfully");
          });
        }
      };
    } catch (err) {
    
      console.error(err);
    }
  };
  useEffect(() => {
    const sud = localStorage.getItem('userData');
    const parseud = JSON.parse(sud);
    setUd(parseud);
    setCurrid(parseud['user']['_id'])
    // Fetch users data from the API
    axios.get('http://localhost:7000/user')
      .then((response) => {
        setUsersData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
      
      }

  , [nc]);

  const handleUserClick =async (userId) => {
    const userIDs = [currid, userId].sort(); // Sort the user IDs
    const commonSubject = `chat.${userIDs[0]}.${userIDs[1]}`;
    setSelectedUserId(userId);
    connectToNats(commonSubject);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') {
      return; // Don't send empty messages
    }
  
    const userIDs = [currid, selectedUserId].sort(); // Sort the user IDs
    const commonSubject = `chat.${userIDs[0]}.${userIDs[1]}`;
  
    if (nc) {
      const messageObject = {
        text: newMessage,
        sender: currid,
        timestamp: new Date().toISOString(), // Include the sender's user ID
      };
  
      nc.publish(commonSubject, sc.encode(JSON.stringify(messageObject)));
      console.log("Sent Message:", newMessage);
    } else {
      console.error("Not connected to NATS");
    }
    setNewMessage('')
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
      {receivedMessages.map((message, index) => (
        <div key={index} className={message.sender === currid ? "sent-message" : "received-message"}>
          <p>{message.text}</p>
          <small>{new Date(message.timestamp).toLocaleString()}</small>
        </div>
      ))}
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
