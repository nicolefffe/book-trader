function SearchCtrl(BookService, User) {

  var vm = this;
  vm.results = null;
  vm.bookAdded = null;

  User.getUser(function() {
    // retrieve user object from User schema
    vm.user = User.info;
  });

  vm.getBooks = function() {

    // strip non-word chars (except spaces) from search query
    var query = vm.search.match(/[\w ]/g);
    query = query.join('');

    // results is an array of objects with an id property and a google property, which is an object
    // containing properties pulled from the Google Books API

    BookService.search(query,function(results) {
      vm.results = results;
      vm.search = null;
    });
  };

  vm.addBook = function(book) {

    User.addBook(book,function() {

      // setting results to null will hide the search results dialog element through the dialogSearchResults directive
      vm.bookAdded = book.google.title;
      vm.results = null;
    });
  };

  vm.closeDialog = function() {

    // setting these vars to null hides both dialog elements through dialogSearchResults & dialogAddBook directives
    vm.results = null;
    vm.bookAdded = null;
  };

};

angular
.module('book-app')
.controller('SearchCtrl', SearchCtrl);
