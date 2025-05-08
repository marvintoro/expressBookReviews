const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  let accessToken = jwt.sign({ username }, "secretKey", { expiresIn: '1h' });
  // Store access token and username in session
  req.session.authorization = {
    accessToken, username
}

  return res.status(200).json({ message: "Login successful", accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { review } = req.body;
  const { isbn } = req.params;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is required." });
  }

  if (!isbn) { 
    return res.status(400).json({ message: "ISBN is required." });
  }
  const book = Object.values(books).find(book => book.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Add or update the review
  if (!book.reviews) {
    book.reviews = {};
  }

  book.reviews = review;
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  return res.status(200).json({ 
    message: "Review added/updated successfully.", 
    reviews: books.reviews 
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required." });
  }

  const book = Object.values(books).find(book => book.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (!book.reviews) {
    return res.status(404).json({ message: "Review not found for this user." });
  }

  // Delete the review
  delete book.reviews;

  return res.status(200).json({ 
    message: "Review deleted successfully.", 
    reviews: book.reviews 
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
