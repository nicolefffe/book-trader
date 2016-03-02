'use strict';
var User = require('../models/users');

module.exports = function() {

  this.addBook = function(user,bookObj,callback) {
    User.findOne({'github.username': user}, function(err,doc) {
      if (err) {
        console.log(err);
      }
      else {
        var match = doc.books.filter(function(element) {
          return element.id === bookObj.id;
        });
        if (match.length > 0) {
          console.log('already in library');
          callback(doc);
        }

        else {
          doc.books.push({'id': bookObj.id, 'available': true, 'google': bookObj.google});
          doc.save(function(err) {
            if (err) {
              console.log(err);
            }
            callback(doc);
          });
        }
      }
    });
  };

  this.removeBook = function(user,book,callback) {
    User.update(
      {'github.username': user},
      {$pull: {'books': {'id': book}}},
      {safe: true},
      function(err) {
        if (err) {
          console.log(err);
        }
        User.findOne({'github.username': user}, function(err,doc) {
          if (err) {
            console.log(err);
            callback(doc);
          }
        });
      }
    )
  };

  this.tradeable = function(user,book,callback) {
    User.findOne({'github.username': user}, function(err,doc) {
      if (err) {
        console.log(err);
      }
      else {
        var match = doc.books.filter(function(element) {
          return element.id === book;
        });
        if (match.length > 0) {
          match[0].available = !match[0].available;
          doc.save(function(err) {
            if (err) {
              console.log(err);
            }
            callback(doc);
          });
        }
        else {
          callback(doc);
        }
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
