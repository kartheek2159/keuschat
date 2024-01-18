import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StringCodec, connect } from 'nats.ws';
import axios from 'axios';
import './chatApp.css'

const ChatApp = () => {
  const [usersData, setUsersData] = useState([]);
  const [ud, setUd] = useState(null);
  const navigate=useNavigate();
  const [currid,setCurrid]=useState('')
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [nc, setConnection] = useState(undefined);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const sc = StringCodec();
  const [chatid,setChatId]=useState('')
  const connectToNats = async (commonSubject) => {
    try {
      const natsConnection = await connect({
        servers: "http://localhost:9090",
        
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
    const userIDs = [currid, userId].sort(); 
    const commonSubject = `chat.${userIDs[0]}.${userIDs[1]}`;
    setSelectedUserId(userId);
    axios.post('http://localhost:7000/chat/',{
      senderid:userIDs[0],
      recieverid:userIDs[1],
    }).then((res)=>{
      console.log(res.data['_id'])
      setChatId(res.data['_id'])
    }).catch((err)=>{
      console.log(err)
    })   
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/msg/${chatid}`);
        const messages = response.data.map((msg) => ({
          text: msg.text,
          sender: msg.senderid, // Extracting sender ID from the response data
          timestamp: msg.createdAt,
        }));
        setReceivedMessages(messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchData();
    connectToNats(commonSubject);
    

  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') {
      return; 
    }
  
    const userIDs = [currid, selectedUserId].sort(); 
    const commonSubject = `chat.${userIDs[0]}.${userIDs[1]}`;
  
    if (nc) {
      const messageObject = {
        text: newMessage,
        sender: currid,
        timestamp: new Date().toISOString(),
      };
  
      nc.publish(commonSubject, sc.encode(JSON.stringify(messageObject)));
      console.log("Sent Message:", newMessage);
    } else {
      console.error("Not connected to NATS");
    }
    axios.post('http://localhost:7000/msg/',{
      chatid:chatid,
      senderid:currid,
      text:newMessage
    }).then((res)=>{
      console.log("msg sent successfully")
    }).catch((err)=>{
      console.log(err)
    })
   
    setNewMessage('')
  };

  const handlelogout=()=>{
    localStorage.removeItem('userData')
    navigate('/login')
  }
  

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
      <button onClick={handlelogout}>Logout</button>

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
