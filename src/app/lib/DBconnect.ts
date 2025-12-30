import mongoose from "mongoose";

const connection: { isConnected?: number } = {};

async function dbConnect() {
  if (connection.isConnected) {
    return mongoose; // Return the mongoose instance
  }

  const db = await mongoose.connect(String(process.env.MONGODB_URI));
  connection.isConnected = db.connections[0].readyState;
  return mongoose;
}

export default dbConnect;
