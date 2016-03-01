function SearchCtrl(BookService, User) {

  var vm = this;
  vm.results = null;

  User.getUser(function() {
    vm.user = User.info;
  });

  vm.getBooks = function(fromNav) {

    var query = vm.search.match(/[\w ]/g);
    query = query.join('');

    BookService.search(query,function(results) {
      vm.results = results;
      vm.search = null;
    });
  };

  vm.addBook = function(id,title) {

    User.addBook(id,function() {

      vm.bookAdded = title;

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
