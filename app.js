const express = require("express");
const { connectDb, getDb } = require("./db"); // Corrected import statement
const app = express();

// Database connection
connectDb((err) => {
  if (!err) {
    app.listen(4000, () => {
      console.log("Connected to port 4000");
    });
  }
});

// Routes
app.get("/books", (req, res) => {
  const db = getDb(); // Get the database object
  const books = [];

  db.collection("books")
    .find()
    .sort({ author: 1 })
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ error: "cannot fetch documents" });
    });
});
