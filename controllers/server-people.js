'use strict';
var User = require('../models/users');

module.exports = function() {

  this.allBooks = function(user,callback) {
    User.find({'github.username': {$ne: user}},'github.username address.city address.state address.country books', function(err,docs) {
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

        // remove any books that the logged-in user already has in their library

        User.findOne({'github.username': user}, 'books', function(err,doc) {
          if (err) {
            console.log(err);
          }
          else {
            arr = arr.filter(function(element) {
              var found = false;
              for (var i = 0; i < doc.books.length; i++) {
                if (doc.books[i].id === element.book.id) {
                  found = true;
                }
              }
              return !found;
            });
          }
          callback(arr);
        });
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
          doc.books.push({'id': bookObj.id, 'available': true, 'borrower': [], 'owner': user, 'google': bookObj.google});
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

  this.decideTrade = function(user,bookID,borrower,approve,callback) {
    User.findOne({'github.username': user}, 'books', function(err,doc) {
      doc.books.forEach(function(element) {
        if (element.id === bookID) {

          if (approve) {
            element.available = false;
            element.borrower = [borrower];

            User.findOne({'github.username': borrower}, function(err,borrowerDoc) {
              if (err) {
                console.log(err);
              }
              else {
                borrowerDoc.borrowed.push(element);
                borrowerDoc.save(function(err) {
                  if (err) {
                    console.log(err);
                  }
                  else {
                    doc.save(function(err) {
                      if (err) {
                        console.log(err);
                      }
                      callback();
                    });
                  }
                });
              }
            });
          }
          else {
            element.borrower = element.borrower.filter(function(b) {
              return b != borrower;
            });
            doc.save(function(err) {
              if (err) {
                console.log(err);
              }
              else {
                callback();
              }
            });
          }
        }
      });
    })
  };

  this.requestTrade = function(requester,bookID,owner,callback) {
    User.findOne({'github.username': owner}, 'books', function(err,doc) {
      doc.books.forEach(function(element) {
        console.log('owner book: ' + element.id + ', requested book: ' + bookID);
        if (element.id === bookID && element.available && element.borrower.indexOf(requester) == -1) {
          element.borrower.push(requester);
        }
      });
      doc.save(function(err) {
        if (err) {
          console.log(err);
        }
        callback();
      });
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
          }
          callback(doc);
        });
      }
    )
  };

  this.returnTrade = function(requester,bookID,owner,callback) {
    User.findOne({'github.username': owner}, 'books', function(err,doc) {
      doc.books.forEach(function(element) {
        console.log('owner book: ' + element.id + ', returning book: ' + bookID);
        if (element.id === bookID && element.borrower.indexOf(requester) >= 0) {
          element.borrower = [];
          element.available = true;
        }
      });
      doc.save(function(err) {
        if (err) {
          console.log(err);
        }
      });
    });

    User.findOne({'github.username': requester}, 'borrowed', function(err,doc) {
      doc.borrowed = doc.borrowed.filter(function(element) {
        return element.id != bookID;
      });
      doc.save(function(err) {
        if (err) {
          console.log(err);
        }
        else {
          callback();
        }
      });
    });
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
