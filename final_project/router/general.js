const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Route for registering a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Route for getting the list of all books
public_users.get('/', function (req, res) {
  let allBooks = '';

  // Loop through each book in the books object
  for (const bookId in books) {
    if (books.hasOwnProperty(bookId)) {
      // Convert the book to a formatted JSON string and add to the response
      allBooks += JSON.stringify(books[bookId], null, 2) + '\n';
    }
  }

  return res.status(200).send(allBooks);
});

// Route for getting book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book);
});

// Route for getting books by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];

  // Loop through each book in the books object
  for (const bookId in books) {
    if (books.hasOwnProperty(bookId) && books[bookId].author === author) {
      booksByAuthor.push(books[bookId]);
    }
  }

  if (booksByAuthor.length === 0) {
    return res.status(404).json({ message: "No books found by this author" });
  }

  return res.status(200).json(booksByAuthor);
});

// Route for getting books by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksWithTitle = [];

  // Loop through each book in the books object
  for (const bookId in books) {
    if (books.hasOwnProperty(bookId) && books[bookId].title.includes(title)) {
      booksWithTitle.push(books[bookId]);
    }
  }

  if (booksWithTitle.length === 0) {
    return res.status(404).json({ message: "No books found with this title" });
  }

  return res.status(200).json(booksWithTitle);
});

// Route for getting book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  const reviews = book.reviews || [];
  return res.status(200).json(reviews);
});

module.exports.general = public_users;
