// ChatApp.js
import React, { useState, useEffect } from 'react';

const ChatApp = () => {
  const [usersData, setUsersData] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messagesData, setMessagesData] = useState({});
  const [newMessage, setNewMessage] = useState('');

  const hardcodedUsers = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Alice' },
    { id: 3, name: 'Bob' },
  ];

  const hardcodedMessages = {
    1: [
      { id: 1, text: 'Hi, how are you?' },
      { id: 2, text: "I'm good, thanks!" },
    ],
    2: [
      { id: 1, text: 'Hello there!' },
      { id: 2, text: "How's it going?" },
    ],
    3: [
      { id: 1, text: 'Hey!' },
      { id: 2, text: "I'm doing well, thanks." },
    ],
  };

  useEffect(() => {
    setUsersData(hardcodedUsers);
    setMessagesData(hardcodedMessages);
  }, []);

  const handleUserClick = (userId) => {
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
    <div>
      <div>
        <h2>User List</h2>
        <ul>
          {usersData.map((user) => (
            <li key={user.id} onClick={() => handleUserClick(user.id)}>
              {user.name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Messages</h2>
        {selectedUserId ? (
          <div>
            <ul>
              {messagesData[selectedUserId]?.map((message) => (
                <li key={message.id}>{message.text}</li>
              ))}
            </ul>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        ) : (
          <p>Select a user to view messages.</p>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
