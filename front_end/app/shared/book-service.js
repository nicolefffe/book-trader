function BookService($http) {

  this.search = function(search,callback) {

    var url = location.protocol + '//' + location.host;
    url += '/books/search?q=';

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

  this.browseBooks = function(callback) {

    var url = location.protocol + '//' + location.host;
    url += '/books/browse';

    $http.get(url)
    .then(function(response) {
      callback(response.data.books);
    });
  };

};

angular
.module('book-app')
.service('BookService', BookService);
