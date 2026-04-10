// db.js - MongoDB connection setup using Mongoose
// Establishes a connection to MongoDB and listens for runtime connection events.

const mongoose = require("mongoose");

// Connect to MongoDB using the connection string from environment variables
const connectDB = async () => {
  try {
    // Modern Mongoose versions no longer require extra connection options
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    // ===== RUNTIME CONNECTION EVENTS =====

    // Triggered if a connection error occurs after initial connection
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB runtime error:", err.message);
    });

    // Triggered if the connection is lost
    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

  } catch (error) {
    // Fail fast if initial connection fails (prevents app running in broken state)
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;