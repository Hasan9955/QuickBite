// test-mongo.js - Simple test without any TypeScript or build process

import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://hasanbinali7556_db_user:9wpOcRYfoLhe89Dg@cluster0.xygoh5i.mongodb.net/quick_bite";

async function testConnection() {
  console.log("Testing MongoDB connection...");
  console.log("This will confirm if it's a code or network issue\n");
  
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ SUCCESS! Connected to MongoDB Atlas!");
    console.log("The issue IS in your code configuration, not network.");
    await mongoose.disconnect();
  } catch (error) {
    console.log("❌ FAILED! Cannot connect to MongoDB Atlas");
    console.log("Error code:", error.code);
    console.log("Error message:", error.message);
    console.log("\nThis confirms it's a NETWORK/DNS issue, not your code.");
  }
}

testConnection();