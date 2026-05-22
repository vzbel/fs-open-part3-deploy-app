// ---- HTTP version Start ----
// const http = require("http");

// let notes = [
//   {
//     id: "1",
//     content: "HTML is easy",
//     important: true,
//   },
//   {
//     id: "2",
//     content: "Browser can execute only JavaScript",
//     important: false,
//   },
//   {
//     id: "3",
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true,
//   },
// ];

// // Create HTTP server
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "application/json" });
//   response.end(JSON.stringify(notes));
// });

// // Listen on port
// const PORT = 3001;
// app.listen(PORT);
// console.log(`Server running on port ${PORT}`);
// ---- HTTP version End ----

// --- Express version Start ---
require("dotenv").config();
const express = require("express");
const Note = require("./models/note.js");

// Create server
const app = express();

// let notes = [
//   {
//     id: "1",
//     content: "HTML is easy",
//     important: true,
//   },
//   {
//     id: "2",
//     content: "Browser can execute only JavaScript",
//     important: false,
//   },
//   {
//     id: "3",
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true,
//   },
// ];

// serve static assets
app.use(express.static("dist"));

// JSON parsing middleware
app.use(express.json());

// print request info middleware
const requestLogger = (request, response, next) => {
  console.log("Method: ", request.method);
  console.log("Path: ", request.path);
  console.log("Body: ", request.body);
  console.log("---");
  next();
};
app.use(requestLogger);

// Homepage
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

// Fetch a single note
app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

// Delete note with the given id
app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

// Notes endpoint
app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

// Make a string for the next untaken id
const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
  return String(maxId + 1);
};

// Create new note
app.post("/api/notes", (request, response) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

// Update a single note
app.put("/api/notes/:id", (request, response, next) => {
  const { content, important } = request.body;

  Note.findById(request.params.id)
    .then((note) => {
      if (!note) {
        return response.status(404).end();
      }

      // update note and save it to db
      note.content = content;
      note.important = important;
      return note
        .save()
        .then((updatedNote) => {
          response.json(updatedNote);
        })
        .catch((error) => {
          next(error);
        });
    })
    .catch((error) => {
      next(error);
    });
});

// handle non-existent routes
const unkownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unkownEndpoint);

// custom error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  // bad id
  if (error.name === "CastError") {
    return response.status(500).send({ error: "malformatted id" });
  }

  // it's some other error we can just let express handle
  next(error);
};
app.use(errorHandler);

// Listen
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// --- Express version End ---
