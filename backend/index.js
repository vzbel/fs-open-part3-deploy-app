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
const express = require("express");

// Create server
const app = express();

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

// allow js on browsers to read the response
const cors = require("cors");
app.use(cors());

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
app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const note = notes.find((note) => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.statusMessage = "Note doesn't exist";
    response.status(404).end();
  }
});

// Remove a specific note
app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end();
});

// Notes endpoint
app.get("/api/notes", (request, response) => {
  response.json(notes);
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

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});

// handle non-existent routes
const unkownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unkownEndpoint);

// Listen
const PORT = process.env.port || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// --- Express version End ---
