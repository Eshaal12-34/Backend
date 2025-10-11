const mongoose = require("mongoose");

async function run() {
 await mongoose.connect("mongodb+srv://eshaalabasyn2010:hWctXbiw996e2koQ@contactform.fnv0vgb.mongodb.net/AbasynSchoolDatabase?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

  const Faculty = mongoose.connection.collection("faculties");

  const duplicates = Faculty.aggregate([
    {
      $group: {
        _id: {
          name: "$name",
          designation: "$designation",
          image: "$image",
          email: "$email",
          section: "$section",
          education: "$education",
          experience: "$experience"
        },
        ids: { $push: "$_id" },
        count: { $sum: 1 }
      }
    },
    { $match: { count: { $gt: 1 } } }
  ]);

  for await (const doc of duplicates) {
    doc.ids.shift();
    await Faculty.deleteMany({ _id: { $in: doc.ids } });
  }

  console.log("Duplicates removed ✅");
  process.exit();
}

run();
