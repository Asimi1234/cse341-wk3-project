const mongoose = require('mongoose');

/**
 * Establishes a single, pooled connection to MongoDB Atlas using Mongoose.
 * Call this once at server startup, before app.listen().
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined. Did you create a .env file?');
  }

  // Mongoose 6+ uses sensible defaults, so no extra options object is needed.
  const conn = await mongoose.connect(uri);
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
};

module.exports = connectDB;
