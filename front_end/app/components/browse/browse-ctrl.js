function BrowseCtrl(BookService, User) {

  var vm = this;

  this.allBooks = null;

  User.getUser(function() {
    vm.user = User.info;
  });

  var getAllBooks = function() {

  };

  this.addBook = function(id,title) {

  };

  this.requestTrade = function(id) {

  };

};

angular
.module('book-app')
.controller('BrowseCtrl', BrowseCtrl);
