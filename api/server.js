const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ Test route to confirm deployment
app.get("/app", (req, res) => {
  res.send("✅ Backend is running perfectly on Vercel!");
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

const contactRoutes = require("../routes/contactRoutes");
app.use("/api/contact", contactRoutes);

const facultyRoutes = require("../routes/facultyRoutes");
app.use("/api/faculty", facultyRoutes);

const serverless = require("serverless-http");
module.exports = serverless(app);

