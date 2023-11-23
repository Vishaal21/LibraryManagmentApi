const express = require("express");
const books = require("./MOCK_DATA");
const fs = require("fs");

const app = express();
const PORT = 8000;

app.use(express.json());

//Routes

//get book with specified id
app.get("/api/books/:id", (req, res) => {
  const id = +req.params.id;
  const book = books.find((book) => book.id === id);
  return res.json(book);
});

//get books based on id, title, author
app.get("/api/books", (req, res) => {
  const { id, title, author, create } = req.query;

  // If there are no query parameters, return all books
  if (!id && !title && !author && !create) {
    return res.json(books);
  }

  // Filter books based on query parameters
  let filteredBooks = [...books];

  if (id) {
    filteredBooks = filteredBooks.filter((book) => book.id === +id);
  }

  if (title) {
    filteredBooks = filteredBooks.filter((book) =>
      book.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  if (author) {
    filteredBooks = filteredBooks.filter((book) =>
      book.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  return res.json(filteredBooks);
});

//it will take the book data in the json format and will asign the book id accordingly
app.post("/api/books", (req, res) => {
  const body = req.body;
  // console.log("Body", body);
  books.push({ ...body, id: books.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(books), (err, data) => {
    return res.json({ status: "sucess", id: books.length });
  });
});

//it will update the book data with according to id of the book
app.patch("/api/books/update/:id", (req, res) => {
  const updatedBookId = parseInt(req.params.id);
  const updatedData = req.body;

  // Find the index of the book with the specified ID
  const bookIndex = books.findIndex((book) => book.id === updatedBookId);
  // console.log(bookIndex);

  if (bookIndex !== -1) {
    // Update the book details by merging existing data with updated data
    books[bookIndex] = Object.assign({}, books[bookIndex], updatedData);

    // Write the updated book in the file
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(books), (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ status: "error", error: "Internal Server Error" });
    }
      return res.json({ status: "sucess" });
    });
  } else {
    // If the book with the specified ID is not found, send an appropriate response
    return res.status(404).send("Book not found");
  }
});

//it will update the entire book of the given id
app.put("/api/books/update/:id", (req, res) => {
  const updatedBookId = parseInt(req.params.id);
  const updatedData = req.body;

  // Find the index of the book with the specified ID
  const bookIndex = books.findIndex((book) => book.id === updatedBookId);

  if (bookIndex !== -1) {
      // Update the entire book details with the new data
      books[bookIndex] = { ...updatedData, id: updatedBookId };

      // Write the updated book in the file
      fs.writeFile("./MOCK_DATA.json", JSON.stringify(books), (err, data) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ status: "error", error: "Internal Server Error" });
          }
          return res.json({ status: "success" });
      });
  } else {
      // If the book with the specified ID is not found, send an appropriate response
      return res.status(404).send("Book not found");
  }
});

//it will delete the book of the given id
app.delete("/api/books/delete/:id", (req, res) => {
  const bookIdToDelete = parseInt(req.params.id);
  // Find the index of the book with the specified ID
  const bookIndex = books.findIndex((book) => book.id === bookIdToDelete);

  if (bookIndex !== -1) {
    // Remove the book from the array
    books.splice(bookIndex, 1);

    // Write the updated book list to the file
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(books), (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ status: "error", error: "Internal Server Error" });
    }
      return res.json({ status: "success" });
    });
  } else {
    // If the book with the specified ID is not found, send an appropriate response
    return res.status(404).send("Book not found");
  }
});

app.listen(PORT, () => console.log(`Server Started At PORT ${PORT}`));
