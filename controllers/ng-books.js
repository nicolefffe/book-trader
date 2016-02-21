angular.module('ng-books',[])
.controller('BooksController',['$http', function($http) {

  this.books;

  this.getBooks = function getBooks() {
    var url = 'http://127.0.0.1:8080/find/?q=';

    var query = this.search;
    query = query.replace(/ /g,'+');
    query = query.match(/[\w\+]/g);
    query = query.join('');
    query = encodeURI(query);

    $http.get(url + query)
    .then(function(response) {

      this.books = response.data.books;
      console.log(this.books);

    });
  };

}]);
