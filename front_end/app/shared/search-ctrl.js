function SearchCtrl(BookService, User) {

  var vm = this;
  vm.results = null;
  vm.bookAdded = null;

  User.getUser(function() {
    vm.user = User.info;
  });

  vm.getBooks = function(fromNav) {

    var query = vm.search.match(/[\w ]/g);
    query = query.join('');

    BookService.search(query,function(results) {
      vm.results = results;
      console.log(vm.results);
      vm.search = null;
    });
  };

  vm.addBook = function(book) {

    User.addBook(book,function() {

      vm.bookAdded = book.google.title;
      vm.results = null;

    });
  };

  vm.closeDialog = function() {
    vm.results = null;
    vm.bookAdded = null;
  };

};

angular
.module('book-app')
.controller('SearchCtrl', SearchCtrl);
