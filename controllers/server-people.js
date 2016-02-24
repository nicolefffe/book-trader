'use strict';
var User = require('../models/users');

module.exports = function() {

  this.getUser = function(user,callback) {
    User.findOne({ 'github.username': user }, function(err,doc) {
      if (err) {
        console.log(err);
      }
      else {
        callback(doc);
      }
    });
  };


  this.addBook = function(user,book,callback) {
    User.findOne({'github.username': user}, function(err,doc) {
      if (err) {
        console.log(err);
      }
      else {
        doc.books.push({'book': book, 'available': true});
        doc.save(function(err) {
          if (err) {
            console.log(err);
          }
          else {
            callback(doc);
          }
        })
      }
    });
  };

  this.setAddress = function(user,address,callback) {
    User.findOne({'github.username': user}, function(err,doc) {
      if (err) {
        console.log(err);
      }
      else {
        doc.address = address;
        doc.save(function(err) {
          if (err) {
            console.log(err);
          }
          else {
            callback(doc);
          }
        });
      }
    });
  };

};
