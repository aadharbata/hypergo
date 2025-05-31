const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Recommendation", recommendationSchema);
