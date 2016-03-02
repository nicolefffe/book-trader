function User($http) {

  var user = {};

  var url = 'http://127.0.0.1:8080/';

  var setAddress = function(obj) {
    user.info.address.street = obj.street;
    user.info.address.city = obj.city;
    user.info.address.state = obj.state;
    user.info.address.postal = obj.postal;
    user.info.address.country = obj.country;
  };

  user.info = {};
  user.info.address = {};
  user.info.library = [];

  user.getUser = function(callback) {

    $http.get(url + 'api/:id')
      .then(function(response) {

        user.info.user = response.data.github.username;
        user.info.display = response.data.github.displayName;
        user.info.books = response.data.books;

        if (user.info.books.length > 0) {
          user.info.books.forEach(function(book) {
            user.info.library.push(book.id);
          });
        }
        setAddress(response.data.address);

        callback();
      });
  };

  user.newAddress = function(addressObj) {
    var q = 'address';

    $http.post(url + q, JSON.stringify(addressObj))
      .then(function(response) {
        setAddress(response.data.address);
    });
  };

  user.addBook = function(book,callback) {
    var q = 'book/new';
    var match = user.info.library.filter(function(element) {
      return element === book.id;
    });

    if (match.length > 0) {
      callback();
    }

    else {

      user.info.library.push(book.id);

      $http.post(url + q, JSON.stringify(book))
        .then(function(response) {
          user.info.books = response.data.books;
          callback();
        });
    }
  };

  user.removeBook = function(id,callback) {
    var q = 'book/update/?del=true&bookID=' + id;
    var match = user.info.library.filter(function(element) {
      return element !== id;
    });

    if (match.length < user.info.library.length) {
      user.info.library = match;

      $http.post(url + q)
        .then(function(response) {
          user.info.books = response.data.books;
          callback();
        });
    }

    else { callback(); }

  };

  user.changeTrade = function(id) {
    var q = 'update/?book=true&trade=true&bookID=' + id;

    $http.post(url + q)
      .then(function(response) {
        user.info.books = response.data.books;
    })
  };

  return user;

};

angular
.module('book-app')
.factory('User', User);
