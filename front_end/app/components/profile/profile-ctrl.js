function ProfileCtrl(BookService, User) {

  var vm = this;

  User.getUser(function() {
    vm.user = User.info;
    vm.library = User.info.books;
  });

  vm.editing = false;

  vm.startEdit = function() {
    vm.editing = true;
  };

  vm.finishEdit = function() {
    User.newAddress({
      'street': vm.street,
      'city': vm.city,
      'state': vm.state,
      'postal': vm.postal,
      'country': vm.country
    });

    vm.editing = false;
  };

  vm.cancelEdit = function() {
    vm.editing = false;
  };

  vm.removeBook = function(id) {
    User.removeBook(id);
  };

  vm.tradeable = function(book) {
    return book.available;
  };

  vm.changeTrade = function(book) {
    User.changeTrade(book);
  };

};

angular
.module('book-app')
.controller('ProfileCtrl', ProfileCtrl);
