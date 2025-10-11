const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
   degree : String,
   institute : String,
   subject : String,
   duration : String,
});
const experienceSchema = new mongoose.Schema({
   title : String,
   organization : String,
   years : String,
});
const facultySchema = new mongoose.Schema({
  name: String,
  designation: String,
  image: String,
  email: String,
  section: String,   // ✅ add this
  education: [educationSchema],
  experience: [experienceSchema],
});


module.exports = mongoose.model("Faculty", facultySchema)
