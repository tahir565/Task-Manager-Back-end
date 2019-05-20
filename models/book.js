var mongoose = require('mongoose');
var Request = require('./request');


var bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required:true,
    trim: true,
  },
  author: {
    type: String,
    trim: true
  },
  version: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true,
  },
  owner:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
});

bookSchema.pre('remove', async function(next){
  book = this;
  await Request.deleteMany({ $or: [ { requestedBookId: book._id }, { exchangeBookId: book._id } ] });
  next();
});
var Book = new mongoose.model('Book', bookSchema);

module.exports = Book;
