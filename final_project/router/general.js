const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
      return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
      return true;
    } else {
      return false;
    }
  };

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
   
    if (username && password) {
      if (!doesExist(username)) {
        users.push({ username: username, password: password });
        return res.status(200).json({ message: "User successfully registered. Now you can login!" });
      } else {
        return res.status(404).json({ message: "User already exists! Go to login instead." });
      }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

async function getAllBooks() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books);
      }, 1);
    });
  }

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  return res.send(await getAllBooks());
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];
    return res.send(book);
 });

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    let filteredBook =  Object.values(books).filter((book) => book.author === author);
    res.send(filteredBook);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    let filteredBook =  Object.values(books).filter((book) => book.title === title);
    res.send(filteredBook);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];
    return res.send(book.reviews);
});

module.exports.general = public_users;
