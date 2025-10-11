// fixFaculty.js
const fs = require("fs");

// 1. Read your broken JSON file
const rawData = fs.readFileSync("facultyBroken.json", "utf-8");

// Split by lines in case each object is on a separate line
const lines = rawData.split("\n").filter(line => line.trim() !== "");

// 2. Parse each line and fix it
const fixedData = lines.map(line => {
  const obj = JSON.parse(line);

  // Convert 'education' and 'experience' from string to JSON array
  try {
    obj.education = JSON.parse(obj.education);
  } catch (e) {
    console.log("Error parsing education for:", obj.name);
    obj.education = [];
  }

  try {
    obj.experience = JSON.parse(obj.experience);
  } catch (e) {
    console.log("Error parsing experience for:", obj.name);
    obj.experience = [];
  }

  return obj;
});

// 3. Write the fixed data to a new file
fs.writeFileSync("facultyFixed.json", JSON.stringify(fixedData, null, 2));

console.log("✅ Fixed faculty data saved to facultyFixed.json");
