import mongoose from "mongoose";
import Faculty from "../../../models/Faculty";  // ✅ use your existing schema

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGO_URI);
};

export default async function handler(req, res) {
  try {
    await connectDB();

    const { section } = req.query;

    if (req.method === "GET") {
      const facultyList = await Faculty.find({ section });
      return res.status(200).json(facultyList);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("❌ API error:", error);
    return res.status(500).json({ message: "Failed to fetch faculty" });
  }
}
