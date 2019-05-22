var mongoose = require('mongoose');

var requestsSchema = new mongoose.Schema({
  requestedBookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exchangeBookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  },
  status: {
    type: String,
    default: 'Requested',
  }
});

var Request = new mongoose.model('Request', requestsSchema);

module.exports = Request;
