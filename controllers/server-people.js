'use strict';
var User = require('../models/users');

module.exports = function() {

  this.allBooks = function(callback) {
    User.find({},'github.username address.city address.state address.country books', function(err,docs) {
      if (err) {
        console.log(err);
      }
      else {
        var arr = [];

        // compile all users' libraries into one array with only one instance of each book

        docs.forEach(function(element) {
          for (var i = 0; i < element.books.length; i++) {

            var found = false;

            arr.forEach(function(added) {

              if (added.book.id === element.books[i].id) {
                found = true;
                if (element.books[i].available) {
                  added.owners.push({
                    'user': element.github.username,
                    'location': element.address.city + ', ' + element.address.state + ' ' + element.address.country
                  });
                }
              }

            });

            if (!found && element.books[i].available) {
              arr.push({
                'book': element.books[i],
                'owners': [{
                  'user': element.github.username,
                  'location': element.address.city + ', ' + element.address.state + ' ' + element.address.country
                }]
              });
            }
          }
        });

        callback(arr);
      }
    });
  };

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

  this.tradeable = function(user,id,callback) {
    User.findOne({'github.username': user}, function(err,doc) {
      if (err) {
        console.log(err);
      }
      else {
        var match = doc.books.filter(function(element) {
          return element.id === id;
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

    // function takes an address object (format defined in /models/users.js)

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
