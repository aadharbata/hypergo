const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { userRouter } = require("./routes/userroute");
const { propertyRouter } = require("./routes/propertyroute");

dotenv.config();

const app = express();
app.use(express.json());

app.use("/user", userRouter);
app.use("/property", propertyRouter);


mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("✅ Connected to MongoDB");
  app.listen(process.env.PORT || 3000, () => {
    console.log("🚀 Server running on port " + (process.env.PORT || 3000));
  });
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});
app.get("/", (req, res) => {
  res.send("API is running!");
});
