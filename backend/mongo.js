const mongoose = require("mongoose");

// get password and connect w/ ipv4 (atlas uses ipv4)
if (process.argv.length < 3) {
  console.log("give password as an argument");
  process.exit(1);
}
const password = process.argv[2];
const url = `mongodb+srv://argumedogael4_db_user:${password}
@cluster0.3hhduoc.mongodb.net/noteApp?appName=Cluster0`;
mongoose.set("strictQuery", false);
mongoose.connect(url, { family: 4 });

// create a schema and model for notes
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});
const Note = mongoose.model("Note", noteSchema);

// make an example note and save it to db
const note = new Note({
  content: "Mongoose makes things easy",
  important: true,
});
note.save().then(() => {
  console.log("note saved!");
  mongoose.connection.close();
});

// print all notes from db
Note.find({ important: false }).then((result) => {
  result.forEach(note => {
    console.log(note);
  });

  mongoose.connection.close();
});
