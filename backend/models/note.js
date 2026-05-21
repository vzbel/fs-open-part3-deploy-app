const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

// connect to mongodb
const url = process.env.MONGODB_URI;
console.log("connecting to", url); // this is probably a bad idea
mongoose
  .connect(url, { family: 4 })
  .then((result) => {
    console.log("conneced to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

// create a schema and model for notes
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

// remove id and version number fields
// from note JSON formatting
noteSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

// allow model to be used by our other modules
module.exports = mongoose.model("Note", noteSchema);
