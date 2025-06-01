const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { userRouter } = require("../routes/userroute");
const { propertyRouter } = require("../routes/propertyroute");
const serverless = require("serverless-http"); // IMPORTANT for Vercel

dotenv.config();

const app = express();
app.use(express.json());

app.use("/user", userRouter);
app.use("/property", propertyRouter);

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log("Connected to MongoDB");
}

// Vercel requires exporting a handler
module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    return serverless(app)(req, res);
  } catch (error) {
    console.error("Function crash error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
