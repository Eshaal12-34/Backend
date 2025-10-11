const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully!");
});

// ✅ FIX THESE PATHS (go one folder up because you're inside /api)
const contactRoutes = require("../routes/contactRoutes");
const facultyRoutes = require("../routes/facultyRoutes");

app.use("/api/contact", contactRoutes);
app.use("/api/faculty", facultyRoutes);

module.exports = app;
