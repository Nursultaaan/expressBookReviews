const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Регистрация нового пользователя (Task 7)
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Получить все книги — Async/Await (Task 2 & Task 11)
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => new Promise((resolve) => resolve(books));
    const allBooks = await getBooks();
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Получить книгу по ISBN — Promise (Task 3 & Task 11)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ message: err }));
});

// Получить книги по автору — Async/Await (Task 4 & Task 11)
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getBooksByAuthor = () => new Promise((resolve) => {
      let matchingBooks = [];
      Object.keys(books).forEach((key) => {
        if (books[key].author === author) {
          matchingBooks.push(books[key]);
        }
      });
      resolve(matchingBooks);
    });

    const result = await getBooksByAuthor();
    return res.status(200).json({ booksbyauthor: result });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// Получить книги по названию — Async/Await (Task 5 & Task 11)
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const getBooksByTitle = () => new Promise((resolve) => {
      let matchingBooks = [];
      Object.keys(books).forEach((key) => {
        if (books[key].title === title) {
          matchingBooks.push(books[key]);
        }
      });
      resolve(matchingBooks);
    });

    const result = await getBooksByTitle();
    return res.status(200).json({ booksbytitle: result });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});

// Получить отзывы по ISBN (Task 6)
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;