const express = require("express");
const Faculty = require("../models/Faculty");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // adjust path if needed
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});


const upload = multer({storage:storage})
router.post(
  "/",
  upload.single("image"),   // ✅ use single instead of fields
  async (req, res) => {
    try {
      console.log("📥 BODY:", req.body);
      console.log("📷 FILE:", req.file);

      const { name, designation, email, section } = req.body;
      const image = req.file ? req.file.filename : null;

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
      res.status(201).json({ message: "Faculty added successfully" });
    } catch (error) {
      console.error("❌ Error in /api/faculty POST:", error);
      res.status(500).json({
        message: "Failed to add faculty",
        error: error.message,
      });
    }
  }
);



router.get("/cv/:id", async (req,res) => {
    try{
        const faculty = await Faculty.findById(req.params.id);
        if(!faculty){
            return res.status(404).json({message: "Faculty not found"})
        }
        res.json(faculty);
    }catch(error){
        res.status(500).json({message: "Internal server error"})
    }
})

router.get("/:section", async (req,res) => {
  try{
      const { section } = req.params;
      const facultyList = await Faculty.find({ section });
      res.json(facultyList);
  }catch(error){
      res.status(500).json({message: "failed to fetch faculty"});
  }
});
module.exports = router;