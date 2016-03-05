function BrowseCtrl(BookService, User) {

  var vm = this;

  vm.allBooks = null;
  vm.bookAdded = null;

  User.getUser(function() {
    vm.user = User.info;
  });

  var getAllBooks = function() {
    BookService.browseBooks(function(results) {
      vm.allBooks = results;
    });
  };

  this.addBook = function(book) {
    User.addBook(book, function() {
      vm.bookAdded = book.google.title;
    });
  };

  this.requestTrade = function(id) {

  };

  getAllBooks();

};

angular
.module('book-app')
.controller('BrowseCtrl', BrowseCtrl);
