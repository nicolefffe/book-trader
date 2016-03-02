'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Book = new Schema(
  {
    id: String,
    available: Boolean,
    borrower: String,
    google: {
      title: String,
      author: String,
      publisher: String,
      date: String,
      description: String,
      isIMG: Boolean,
      isBlank: Boolean,
      img: String
    }
  }
);

var Address = new Schema(
  {
    street: String,
    city: String,
    state: String,
    postal: String,
    country: String
  }
);

var User = new Schema(
  {
    github: {
      id: String,
      displayName: String,
      username: String,
      publicRepos: Number
    },
    address: Address,
    books: [Book],
    versionKey: false
  }
);

module.exports = mongoose.model('User', User);
