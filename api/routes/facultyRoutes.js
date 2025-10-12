const express = require("express");
const Faculty = require("../../models/Faculty");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ✅ 1. Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ 2. Setup Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "faculty_images", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

// ✅ 3. Use Multer with Cloudinary storage
const upload = multer({ storage: storage });

// ✅ 4. POST Route (upload image + data)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("📥 BODY:", req.body);
    console.log("📷 FILE:", req.file);

    const { name, designation, email, section } = req.body;
    const image = req.file ? req.file.path : null; // ✅ Cloudinary URL

    const education = JSON.parse(req.body.education || "[]");
    const experience = JSON.parse(req.body.experience || "[]");

    const newFaculty = new Faculty({
      name,
      designation,
      email,
      section,
      image,
      education,
      experience,
    });

    await newFaculty.save();
    res.status(201).json({ message: "✅ Faculty added successfully" });
  } catch (error) {
    console.error("❌ Error in /api/faculty POST:", error);
    res.status(500).json({
      message: "Failed to add faculty",
      error: error.message,
    });
  }
});

// ✅ 5. GET route to view specific faculty by ID
router.get("/cv/:id", async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ 6. GET route to get faculty by section
router.get("/:section", async (req, res) => {
  try {
    const { section } = req.params;
    const facultyList = await Faculty.find({ section });
    res.json(facultyList);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch faculty" });
  }
});

module.exports = router;
