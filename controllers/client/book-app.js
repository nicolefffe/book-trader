var app = angular.module('book-app',[]);

app.service('BookService',function($http) {

  this.search = function(search,callback) {

    var books = {};
    var url = 'http://127.0.0.1:8080/books/?q=';

    var query = search;
    query = query.replace(/ /g,'+');
    query = query.match(/[\w\+]/g);
    query = query.join('');
    query = encodeURI(query);

    $http.get(url + query)
    .then(function(response) {

      books = response.data.books;
      callback(books);

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

  user.getUser = function() {

    $http.get(url + 'api/:id')
      .then(function(response) {

        user.info.user = response.data.github.username;
        user.info.display = response.data.github.displayName;
        user.info.books = response.data.books;

        user.setAddress(response.data.address);

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

  return user;

});

app.controller('BookTradeController',function($scope, $http, BookService, User) {

  $scope.editing = false;
  $scope.bookResults = false;

  User.getUser();

  $scope.user = User.info;

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

  $scope.getBooks = function() {
    $scope.bookResults = false;

    BookService.search($scope.search,function(results) {
      $scope.books = results;
      $scope.bookResults = true;
    });
  };

});
