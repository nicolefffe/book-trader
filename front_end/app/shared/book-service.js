function BookService($http) {

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

  this.removeFromDisplay = function(id,arr,callback) {

    var library = arr;

    var match = library.filter(function(element) {
      return element.id !== id;
    });

    callback(match);
  };

};

angular
.module('book-app')
.service('BookService', BookService);
