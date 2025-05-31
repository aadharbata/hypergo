const { Router } = require("express");
const propertyRouter = Router();
const { Property } = require("../models/propertymodel");
const { User } = require("../models/usermodel");
const { authMiddleware } = require("../middlewares/auth");
const { Favorite } = require("../models/favorite");
// const { Recommendation } = require("../models/recommendationmodel");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

propertyRouter.get("/from-csv", async (req, res) => {
  try {
    const results = [];
    const filePath = path.join(__dirname, "../data/a.csv");

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        res.json(results); // Send all CSV property data as JSON
      });
  } catch (err) {
    console.error("Error reading CSV:", err);
    res.status(500).json({ message: "Server error reading CSV" });
  }
});


// Create property
propertyRouter.post("/", authMiddleware, async (req, res) => {
  const property = await Property.create({ ...req.body, createdBy: req.userId });
  res.json(property);
});

// Get all properties with filtering
propertyRouter.get("/", async (req, res) => {
  const query = {};
  const {
    city, state, type, furnished, listedBy, listingType,
    bedrooms, bathrooms, priceMin, priceMax, areaMin, areaMax,
    amenities, tags, isVerified
  } = req.query;

  if (city) query.city = city;
  if (state) query.state = state;
  if (type) query.type = type;
  if (furnished) query.furnished = furnished;
  if (listedBy) query.listedBy = listedBy;
  if (listingType) query.listingType = listingType;
  if (bedrooms) query.bedrooms = Number(bedrooms);
  if (bathrooms) query.bathrooms = Number(bathrooms);
  if (isVerified) query.isVerified = isVerified === "true";

  if (priceMin || priceMax) {
    query.price = {};
    if (priceMin) query.price.$gte = Number(priceMin);
    if (priceMax) query.price.$lte = Number(priceMax);
  }

  if (areaMin || areaMax) {
    query.areaSqFt = {};
    if (areaMin) query.areaSqFt.$gte = Number(areaMin);
    if (areaMax) query.areaSqFt.$lte = Number(areaMax);
  }

  if (amenities) query.amenities = new RegExp(amenities, "i");
  if (tags) query.tags = new RegExp(tags, "i");

  const properties = await Property.find(query);
  res.json(properties);
});

// Update property
propertyRouter.put("/:id", authMiddleware, async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ message: "Not found" });
  if (property.createdBy.toString() !== req.userId)
    return res.status(403).json({ message: "Unauthorized" });
  await Property.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Property updated" });
});

// Delete property
propertyRouter.delete("/:id", authMiddleware, async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ message: "Not found" });
  if (property.createdBy.toString() !== req.userId)
    return res.status(403).json({ message: "Unauthorized" });
  await Property.findByIdAndDelete(req.params.id);
  res.json({ message: "Property deleted" });
});
propertyRouter.post("/recommend/:propertyId", authMiddleware, async (req, res) => {
  try {
    const { recipientEmail } = req.body;
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: "Property not found" });

    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) return res.status(404).json({ message: "Recipient not found" });

    const alreadyRecommended = await Recommendation.findOne({
      from: req.userId,
      to: recipient._id,
      property: propertyId,
    });

    if (alreadyRecommended) {
      return res.status(400).json({ message: "Already recommended to this user" });
    }

    const recommendation = new Recommendation({
      from: req.userId,
      to: recipient._id,
      property: propertyId,
    });

    await recommendation.save();

    res.json({ message: "Property recommended successfully" });
  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

propertyRouter.get("/recommendations/received", authMiddleware, async (req, res) => {
  try {
    const recommendations = await Recommendation.find({ to: req.userId })
      .populate("from", "name email")             // Optional: to show who sent it
      .populate("property");                      // Gets full property details

    res.json({ recommendations });
  } catch (err) {
    console.error("Fetch recommendations error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Add to favorites
// Add property to favorites
// Add property to favorites using Favorite collection
propertyRouter.post("/favorite/:id", authMiddleware, async (req, res) => {
  try {
    const propertyId = req.params.id;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Optional: Check if already in favorites
    const alreadyFavorited = await Favorite.findOne({
      user: req.userId,
      property: propertyId,
    });

    if (alreadyFavorited) {
      return res.status(400).json({ message: "Property already in favorites" });
    }

    // Create favorite
    const favorite = new Favorite({
      user: req.userId,
      property: propertyId,
    });

    await favorite.save();

    res.json({ message: "Property added to favorites" });
  } catch (err) {
    console.error("Favorite error:", err.message || err);
    res.status(500).json({ message: "Server error" });
  }
});



propertyRouter.get("/favorite", authMiddleware, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.userId }).populate("property");
    res.json(favorites);
  } catch (err) {
    console.error("Fetch favorites error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove from favorites
propertyRouter.delete("/favorite/:propertyId", authMiddleware, async (req, res) => {
  const { propertyId } = req.params;
  const user = await User.findById(req.userId);
  user.favorites = user.favorites.filter(id => id.toString() !== propertyId);
  await user.save();
  res.json({ message: "Property removed from favorites" });
});

module.exports = { propertyRouter };
