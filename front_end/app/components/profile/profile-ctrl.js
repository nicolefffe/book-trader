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

    User.removeBook(id,function() {
      BookService.removeFromDisplay(id,User.info.library,function(results) {
        vm.library = results;
      });
    });
  };

  vm.tradeable = function(id) {
    var match = User.info.books.filter(function(element) {
      return element.id === id;
    });
    return match[0].tradeable;
  };

  vm.changeTrade = function(id) {
    User.changeTrade(id);
  };

};

angular
.module('book-app')
.controller('ProfileCtrl', ProfileCtrl);
