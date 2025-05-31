const { Router } = require("express");
const userRouter = Router();
const { usermodel } = require("../models/usermodel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;


userRouter.post("/signup", async function (req, res) {
  const { email, password, firstName, lastName } = req.body;

  await usermodel.create({
    email,
    password,
    firstName,
    lastName,
  });

  res.json({ message: "signup succedded" });
});

userRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;
  const user = await usermodel.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD);
  res.json({ token });
});

module.exports = { userRouter };