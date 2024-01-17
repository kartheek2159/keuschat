// natsConnection.js

import { connect } from 'nats.ws';

const startNatsConnection = async () => {
  try {
    const natsConnection = await connect({
      servers: "http://localhost:9090", // Update with your NATS server information
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
      },
    });

    console.log("Connected to NATS");
    return natsConnection;
  } catch (error) {
    console.error("Error connecting to NATS:", error);
    throw error;
  }
};

export default startNatsConnection;
