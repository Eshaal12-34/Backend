const express = require("express");
const mongoose = require("mongoose")
require('dotenv').config();
const cors = require("cors");
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use("/uploads" , express.static("uploads"))

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Backend is running and MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err.message));
app.get("/app", (req,res) => {
    res.send("App is running")
})

const contactRoutes = require("../routes/contactRoutes")
app.use("/api/contact",contactRoutes)
const facultyRoutes = require("../routes/facultyRoutes")
app.use("/api/faculty",facultyRoutes)

app.listen(PORT, () =>{
  console.log("Server is running on port 5000")
})