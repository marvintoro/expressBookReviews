const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
 
  //Write your code here
  try {
    const response = await axios.get('http://localhost:3000/router/booksdb.js');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book list", error: error.message });
  }
 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:3000/router/booksdb.js`);
    const book = Object.values(response.data).find(book => book.isbn === isbn);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching book details", error: error.message });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
const author = req.params.author;
try {
  const response = await axios.get('http://localhost:3000/router/booksdb.js');
  const booksByAuthor = Object.values(response.data).filter(book => book.author === author);
  if (booksByAuthor.length > 0) {
    res.status(200).json(booksByAuthor);
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
} catch (error) {
  res.status(500).json({ message: "Error fetching books by author", error: error.message });
}
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {

  const title = req.params.title;
  try {
    const response = await axios.get('http://localhost:3000/router/booksdb.js');
    const booksByTitle = Object.values(response.data).filter(book => book.title === title);
    if (booksByTitle.length > 0) {
      res.status(200).json(booksByTitle);
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
const isbn = req.params.isbn;
const book = Object.values(books).find(book => book.isbn === isbn);
if (book && book.reviews) {
  res.send(book.reviews);
} else {
  res.status(404).json({ message: "No reviews found for this book" });
}
});

module.exports.general = public_users;
