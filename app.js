const express = require("express");
const { connectDb, getDb } = require("./db"); // Corrected import statement
const { ObjectId } = require("mongodb");
const app = express();
app.use(express.json()); //With express.json() middleware added, Express will automatically parse incoming JSON requests,
// and req.body will contain the parsed JSON data.

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

app.get("/books/:id", (req, res) => {
  const db = getDb();
  console.log(req.params.id);
  db.collection("books")
    .findOne({ _id: new ObjectId(req.params.id) })
    .then((doc) => {
      console.log("Found");
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
      console.log("Error");
    });
});

app.post("/books", (req, res) => {
  const db = getDb();
  const book = req.body;
  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(book);
      console.log("error occured");
      res.status(500).json(err);
    });
});

app.delete("/books/:id", (req, res) => {
  const id = req.params.id;
  const db = getDb();
  if (ObjectId.isValid(id)) {
    const objectId = new ObjectId(id);
    db.collection("books")
      .deleteOne({ _id: objectId })
      .then((result) => {
        if (result.deletedCount === 1) {
          console.log("Document successfully deleted");
          res.status(200).json({ message: "Document successfully deleted" });
        } else {
          console.log("No document found with the provided id");
          res
            .status(404)
            .json({ message: "No document found with the provided id" });
        }
      })
      .catch((err) => {
        console.log("Error occurred:", err);
        res
          .status(500)
          .json({ error: "An error occurred while deleting the document" });
      });
  } else {
    console.log("Invalid id format");
    res.status(400).json({ error: "Invalid id format" });
  }
});
