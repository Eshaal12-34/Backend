// migrateUploadsToCloudinary.js
require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const Faculty = require("./models/Faculty"); // adjust path if needed

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

const uploadsDir = path.join(__dirname, "uploads");

async function migrateImages() {
  try {
    const files = fs.readdirSync(uploadsDir);
    console.log(`📦 Found ${files.length} files in uploads`);

    for (const file of files) {
      const localPath = path.join(uploadsDir, file);

      console.log(`☁️ Uploading ${file} to Cloudinary...`);
      const result = await cloudinary.uploader.upload(localPath, {
        folder: "faculty_images",
      });

      console.log(`✅ Uploaded: ${result.secure_url}`);

      // ✅ Update MongoDB record where image = old filename
      const faculty = await Faculty.findOneAndUpdate(
        { image: file },
        { image: result.secure_url },
        { new: true }
      );

      if (faculty) {
        console.log(`🟢 Updated faculty: ${faculty.name}`);
      } else {
        console.log(`⚠️ No faculty found for ${file}`);
      }

    }

    console.log("🎉 Migration complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during migration:", err);
    process.exit(1);
  }
}

migrateImages();
