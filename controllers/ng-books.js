var app = angular.module('ng-books',[]);

app.controller('BooksController',['$scope','$http', function($scope, $http) {

  $scope.books = false;

  $scope.getBooks = function() {
    var url = 'http://127.0.0.1:8080/find/?q=';

    $scope.books = false;

    var query = $scope.search;
    query = query.replace(/ /g,'+');
    query = query.match(/[\w\+]/g);
    query = query.join('');
    query = encodeURI(query);

    $http.get(url + query)
    .then(function(response) {

      $scope.books = response.data.books;
      console.log($scope.books);

    });
  };

}]);
