var app = angular.module('book-app',[]);

app.service('BookService',function($http) {

  this.search = function(search,callback) {

    var url = 'http://127.0.0.1:8080/books/?type=search&q=';

    var query = search;
    query = query.replace(/ /g,'+');
    query = query.match(/[\w\+]/g);
    query = query.join('');
    query = encodeURI(query);

    $http.get(url + query)
    .then(function(response) {
        callback(response.data.books);
    });
  };

  this.getLibrary = function(arr,callback) {

    var library = arr;
    var url = 'http://127.0.0.1:8080/books/?type=lib&q=';

    library = library.join(',');

    $http.get(url + library)
    .then(function(response) {
        callback(response.data.books);
    });
  };

});

app.factory('User',function($http) {

  var user = {};
  user.info = {};
  user.info.address = {};

  var url = 'http://127.0.0.1:8080/';

  user.setAddress = function(obj) {
    user.info.address.street = obj.street;
    user.info.address.city = obj.city;
    user.info.address.state = obj.state;
    user.info.address.postal = obj.postal;
    user.info.address.country = obj.country;
  };

  user.getUser = function(callback) {

    $http.get(url + 'api/:id')
      .then(function(response) {

        user.info.user = response.data.github.username;
        user.info.display = response.data.github.displayName;
        user.info.books = response.data.books;

        user.setAddress(response.data.address);

        callback();
      });
  };

  user.newAddress = function(addressObj) {
    var q = 'update/?addr=true&street=' + addressObj.street + '&city=' + addressObj.city;
    q += '&state=' + addressObj.state + '&postal=' + addressObj.postal + '&country=' + addressObj.country;

    q = q.replace(/ /g,'+');
    q = q.match(/[\w\+=&?]/g);
    q = q.join('');

    $http.post(url + q)
      .then(function(response) {
        user.setAddress(response.data.address);
    });
  };

  user.addBook = function(id) {
    var q = 'update/?book=true&new=true&bookID=' + id;

    q = q.replace(/ /g,'+');
    q = q.match(/[\w\+=&?]/g);
    q = q.join('');
    console.log(url + q);

    $http.post(url + q)
      .then(function(response) {
        user.info.books = response.data.books;
    });
  };

  user.tradeable = function(bool,id) {
    var q = 'update/?book=true&trade=' + bool + '&bookID=' + id;

    $http.post(url + q)
      .then(function(response) {
        user.info.books = response.data.books;
    })
  };

  return user;

});

app.controller('BookTradeController',function($scope, $http, BookService, User) {

  $scope.editing = false;
  $scope.bookResults = false;
  $scope.bookAdded = false;

  var library = [];

  User.getUser(function() {
    $scope.user = User.info;

    if (User.info.books.length > 0) {
      User.info.books.forEach(function(book) {
        library.push(book.id);
      });
      BookService.getLibrary(library,function(results) {
        if (results.error) {
          $scope.books = null;
        }
        else {
          $scope.books = results;
        }
      });
    }
    else { $scope.books = null; }
  });

  $scope.startEdit = function() {
    $scope.editing = true;
  };

  $scope.finishEdit = function() {
    User.newAddress({
      'street': $scope.street,
      'city': $scope.city,
      'state': $scope.state,
      'postal': $scope.postal,
      'country': $scope.country
    });

    $scope.editing = false;
  };

  $scope.cancelEdit = function() {
    $scope.editing = false;
  };

  $scope.getBooks = function() {
    $scope.bookResults = false;

    BookService.search($scope.search,function(results) {
      if (results.error) {
        $scope.books = null;
      }
      else {
        $scope.books = results;
        $scope.bookResults = true;
      }
    });
  };

  $scope.addBook = function(id,title) {
    User.addBook(id);
    $scope.bookAdded = title;
  };

  $scope.tradeable = function(toggle,id) {
    var match = User.info.books.filter(function(element) {
      return element.id === id;
    });

    var avail = match[0].available;

    if (!toggle) {
      return avail;
    }

    else {
      User.tradeable(!avail,id);
    }
  };

  $scope.closeDialog = function() {
    $scope.bookAdded = false;
  };

});
