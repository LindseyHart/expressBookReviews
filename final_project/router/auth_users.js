const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 
    //returns boolean
    //write code to check if username and password match the one we have in records.
    const matchingUsers = users.filter((user) => user.username === username && user.password === password);
    return matchingUsers.length > 0;
}
  
//  Only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({data:password}, "access", {expiresIn: 3600});
      req.session.authorization = {accessToken,username};
      return res.status(200).send("User successfully logged in");
    }
    else {
      return res.status(208).json({message: "Invalid username or password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let user = req.user;
  let review = req.body.review;
  let book = books[isbn];

  book.reviews[user] = review;
  return res.status(200).json({ message: "Review successfully added." });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    let isbn = req.params.isbn;
    let user = req.user;
    let review = req.body.review;
    let book = books[isbn];
    delete book.reviews[user];
  
    return res.status(200).json({ message: "Deleted Sucessfully" });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
