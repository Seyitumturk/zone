const mongoose = require("mongoose");

async function connectDB() {
  const mongoDBURL = "mongodb://127.0.0.1:27017/zoneio";

  try {
    await mongoose.connect(mongoDBURL, {
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

module.exports = {
  connectDB,
};
