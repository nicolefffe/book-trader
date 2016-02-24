'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Book = new Schema(
  {
    id: String,
    available: Boolean
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
    address: {
      street: String,
      city: String,
      state: String,
      postal: String,
      country: String
    },
    books: [Book],
    versionKey: false
  }
);

module.exports = mongoose.model('User', User);
