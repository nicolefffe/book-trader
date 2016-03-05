function ProfileCtrl(BookService, User) {

  var vm = this;

  User.getUser(function() {
    // retrieve user object from User schema and assign books array in user object to vm.library
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

  vm.changeTrade = function(id) {
    User.changeTrade(id);
  };

};

angular
.module('book-app')
.controller('ProfileCtrl', ProfileCtrl);
