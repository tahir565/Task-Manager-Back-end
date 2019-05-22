var express = require('express');
var Book = require('../models/book');
var auth = require('../middleware/auth');

var router = new express.Router();

router.get('/books', auth, async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).send(books);
  } catch (e) {
    res.status(400).send(e.message);
  }

});

router.get('books/:id', auth, async (req, res) => {
  try {
    var books = await Book.find({ _id: req.params.id, owner: req.user._id });

    if (!books) {
      return res.status(400).send();
    }
    res.status(200).send(books);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/book/post', auth, async (req, res) => {
  var data = ['title', 'author', 'version', 'description'];
  var received = Object.keys(req.body);

  var isValidPost = received.length <= 4 && received.every(key => data.includes(key));

  if (!isValidPost) {
    return res.status(400).send({ error: 'Not a valid post!' })
  }

  try {
    var book = new Book({ ...req.body, owner: req.user._id });
    await book.save();
    res.status(201).send(book);
  } catch (e) {
    res.status(400).send(e.message);
  }

});

router.patch('/book/:id', auth, async (req, res) => {
  var allowedUpdates = ['title', 'author', 'version', 'description'];
  var received = Object.keys(req.body);

  var isValidUpdate = received.every(key => allowedUpdates.includes(key));

  if (!isValidUpdate) {
    return res.status(400).send({ error: 'Not a valid Update!' });
  }

  try {
    var book = await Book.findOne({ _id: req.params.id, owner: req.user._id });

    if (!book) {
      return res.status(404).send({ error: 'Not Found!' })
    }

    received.forEach(update => book[update] = req.body[update]);
    await book.save();
    res.status(200).send(book);
  } catch (e) {
    res.status(400).send(e.message)
  }

});

router.delete('/book/:id', auth, async (req, res) => {
  try {
    var book = await Book.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!book) {
      return res.status(400).send({ error: "Not Found" });
    }

    res.status(200).send(book);
  } catch (e) {
    res.status(400).send(e.message)
  }

});



module.exports = router;
