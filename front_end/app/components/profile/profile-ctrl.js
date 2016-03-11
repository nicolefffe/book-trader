function ProfileCtrl(BookService, User) {

  var vm = this;
  vm.editing = false;
  vm.trading = null;

  User.getUser(function() {
    // retrieve user object from User schema and assign books array in user object to vm.library
    vm.user = User.info;
    vm.library = User.info.books;
  });

  vm.approveTrade = function(id,borrower) {
    User.approveTrade({'id': id, 'borrower': borrower},function() {
      vm.trading = null;
    });
  };

  vm.cancelEdit = function() {
    vm.editing = false;
  };

  vm.changeTrade = function(id) {
    User.changeTrade(id);
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

  vm.removeBook = function(id) {
    User.removeBook(id);
  };

  vm.reviewTrade = function(book) {
    vm.trading = book;
    console.log('attempting trade for: ' + JSON.stringify(vm.trading));
  };

  vm.startEdit = function() {
    vm.editing = true;
  };

};

angular
.module('book-app')
.controller('ProfileCtrl', ProfileCtrl);
