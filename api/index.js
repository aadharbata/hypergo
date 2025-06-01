const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const serverless = require("serverless-http");

const { userRouter } = require("../routes/userroute");
const { propertyRouter } = require("../routes/propertyroute");

dotenv.config();

const app = express();
app.use(express.json());

app.use("/user", userRouter);
app.use("/property", propertyRouter);

app.get("/", (req, res) => {
  res.send("✅ Backend is working on Vercel!");
});

let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) return;
  await mongoose.connect(process.env.MONGO_URI);
  cachedDb = mongoose.connection;
}
connectToDatabase();

module.exports.handler = serverless(app);
