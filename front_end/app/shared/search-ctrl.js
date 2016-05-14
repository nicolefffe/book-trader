function SearchCtrl(BookService, User) {

  var vm = this;

  vm.results = null;
  vm.allBooks = null;
  vm.trading = null;
  vm.titleAdded = null;
  vm.bookAdded = null;


  User.getUser(function() {
    // retrieve user object from User schema
    vm.user = User.info;
  });

  vm.addBook = function(book) {

    User.addBook(book,function() {

      // setting results to null will hide the search results dialog element through the dialogSearchResults directive
      vm.titleAdded = book.google.title;
      vm.bookAdded = book;
      vm.results = null;
    });
  };

  vm.closeDialog = function() {

    // setting these vars to null hides both dialog elements through dialogSearchResults & dialogAddBook directives
    vm.results = null;
    vm.bookAdded = null;
    vm.trading = null;
  };

  vm.findTrade = function(book) {
    console.log('attempting trade for ' + book.book.id)
    vm.trading = book;
  };

  vm.getAllBooks = function() {

    // because the profile page also uses SearchCtrl, we use a directive to call this function only when browsing books
    BookService.browseBooks(function(results) {
      vm.allBooks = results;
      console.log(vm.allBooks);
    });
  };

  vm.getBooks = function() {

    // strip non-word chars (except spaces) from search query
    var query = vm.search.match(/[\w ]/g);
    query = query.join('');

    // results is an array of objects with an id property and a google property, which is an object
    // containing properties pulled from the Google Books API

    BookService.search(query,function(results) {
      vm.results = results;
      if (vm.results) {
        console.log('no results found');
      }
      vm.search = null;
    });
  };

  vm.makeTrade = function(id,owner) {
    BookService.requestTrade({'book': id, 'owner': owner},function() {
      vm.trading = null;
    });
  };

};

angular
.module('book-app')
.controller('SearchCtrl', SearchCtrl);
