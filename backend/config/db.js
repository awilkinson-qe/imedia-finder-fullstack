// db.js - MongoDB connection setup using Mongoose
// This module establishes a connection to MongoDB using Mongoose and handles connection events.

const mongoose = require("mongoose");

// Establish a connection to MongoDB using Mongoose.
const connectDB = async () => {
  try {
    // Connect using the URI from environment variables.
    await mongoose.connect(process.env.MONGODB_URI, {
      // These are safe defaults for modern Mongoose versions.
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected");

    // Log connection issues after initial connect (e.g. network drop).
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB runtime error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

  } catch (error) {
    // Fail fast if initial connection cannot be established.
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;