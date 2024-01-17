import { useState, useEffect } from 'react';
import { StringCodec, connect } from 'nats.ws';


function App() {
  const [nc, setConnection] = useState(undefined);
  const [lastError, setLastError] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [sendMessage, setSendMessage] = useState("");
  const sc = StringCodec();

  useEffect(() => {
    if (nc === undefined) {
      const connectToNats = async () => {
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

          const subscription = natsConnection.subscribe("trail", {
            callback: (err, msg) => {
              if (err) {
                console.error(err);
              } else {
                const message = sc.decode(msg.data);
                console.log("Received message:", message);
                setReceivedMessages((prevMessages) => [...prevMessages, message]);
              }
            },
          });
          console.log(subscription);

          return () => subscription.unsubscribe();
        } catch (err) {
          setLastError("Error connecting");
          console.error(err);
        }
      };

      connectToNats();
    }
  }, [nc]);

  useEffect(() => {
    if (nc) {
      const state = nc ? "Connected" : "Not Connected";
      console.log(state);
    }
  }, [nc]);

  const handleSend = () => {
    if (nc) {
      const subject = "trail";
      nc.publish(subject, sc.encode(sendMessage));
      console.log(sendMessage);
    } else {
      console.error("Not connected to NATS");
    }
  };

  return (
    <div className="App">
      <h1>Kartheek</h1>
      <h1>{nc ? "Connected" : "Not Connected"}</h1>
      <h3>{lastError ? lastError : ""}</h3>
      {/* Display all received messages */}
      {receivedMessages.map((message, index) => (
        <p key={index}>Received Message: {message}</p>
      ))}
      <input
        type="text"
        value={sendMessage}
        onChange={(e) => setSendMessage(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={handleSend}>Send Message</button>
    </div>
  );
}

export default App;




