import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authroute from './routes/authroute.js';
import chatroute from './routes/chatroute.js';
import msgroute from './routes/msgroute.js';
import userroute from './routes/userroute.js';
// import WebSocket from 'ws';
import {StringCodec,connect} from 'nats.ws';
import axios from 'axios';

// const WebSocket = require('ws').Server;
// const web = new WebSocket('ws://localhost:9090');

const sc =  StringCodec()
const app = express();
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
dotenv.config();
app.use('/auth', authroute);
app.use('/chat', chatroute);
app.use('/msg', msgroute);
app.use('/user', userroute);

const connectToNats = async () => {
  try {
    console.log("Trying to make a connection to NATS");
    
    const natsConnection = await connect({
      servers: "http://nats:9090",
      
      
    });

    console.log("Connected to NATS");
    const subscription = natsConnection.subscribe('chat.>', {
      callback: async(err, msg) => {
        if (err) {
          console.error(err);
        } else {
          const messageObject = JSON.parse(sc.decode(msg.data));
          console.log('----------------------------------------------------')
          console.log("Received message for the global client:", messageObject);
          console.log('----------------------------------------------------')
          try {
            const apiResponse = await axios.post('http://localhost:7000/msg', {
              chatid: messageObject.cid,
              senderid: messageObject.sender,
              text: messageObject.text,
            });

            console.log('API Response:', apiResponse.data);
          } catch (apiError) {
            console.error('Error calling API to store message details:', apiError);
          }

        }
      },
    });
    console.log("Subscription:", subscription);

  } catch (err) {
    console.error("Error connecting to NATS:", err);
  }
};

const startServer = async () => {
  try {
    
    await mongoose.connect(process.env.mongo_db_url, { dbName: 'ChatKeus' });
    console.log("Connected to MongoDB");

    // Call connectToNats() after MongoDB connection is established
    // Start the server after both MongoDB and NATS connections are established
    app.listen(process.env.port, () => {
      console.log("Server connected to MongoDB and NATS on port " + process.env.port);
    });

  } catch (error) {
    console.error("Error:", error);
  }
};

// Start the server and establish connections
startServer();

connectToNats();


