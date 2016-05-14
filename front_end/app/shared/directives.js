function allBooks() {

  // Wait until this directive is used to call the search controller's getAllBooks's function & fetch all tradeable books

  function link(scope,element) {
    scope.search.getAllBooks();
  }

  return {
    restrict: 'A',
    controller: 'SearchCtrl',
    controllerAs: 'search',
    scope: false,
    bindToController: true,
    templateUrl: '/app/shared/templates/all-books.html',
    link: link
  };
};

function dialogAddBook() {

  // Display element if a book has been added to a user's library

  function link(scope,element) {
    scope.$watch('search.bookAdded', function(newVal) {
      if (newVal == null) {
        $(element).hide();
      }
      else {
        $(element).show();
      }
    });
  }

  return {
    restrict: 'A',
    controller: 'SearchCtrl',
    controllerAs: 'search',
    bindToController: true,
    templateUrl: '/app/shared/templates/dialog-add-book.html',
    scope: false,
    link: link
  };
};

function dialogSearchResults() {

  // Display element if search results are available

  function link(scope,element) {
    scope.$watch('search.results',function(newVal) {
      console.log(newVal);
      if (newVal == null) {
        $(element).hide();
      }
      else {
        $(element).show();
      }
    });
  }

  return {
    restrict: 'A',
    controller: 'SearchCtrl',
    controllerAs: 'search',
    bindToController: true,
    templateUrl: '/app/shared/templates/dialog-search-results.html',
    scope: false,
    link: link
  };
};

function removeBook() {

  // Remove container for individual book in profile library when child button is clicked

  function link(scope,element) {
    element.on('click', function() {
      scope.$destroy();
      element.parent().parent().remove();
    });
  }

  return {
    restrict: 'A',
    scope: {},
    link: link
  };
};

function reviewTrade() {

  function link(scope,element) {
    scope.$watch('profile.trading',function(newVal) {
      if (newVal == null) {
        $(element).hide();
      }
      else {
        $(element).show();
      }
    });
  }

  return {
    restrict: 'A',
    controller: 'ProfileCtrl',
    controllerAs: 'profile',
    bindToController: true,
    templateUrl: '/app/shared/templates/review-trade.html',
    scope: false,
    link: link
  };
};

function showBorrowed() {

  function link(scope,element) {

  }

  return {
    restrict: 'A',
    controller: 'ProfileCtrl',
    controllerAs: 'profile',
    bindToController: {
      borrowed: '='
    },
    templateUrl: '/app/shared/templates/show-borrowed.html',
    link: link
  };
};

function showLibrary() {

  function link(scope,element) {

  }

  return {
    restrict: 'A',
    controller: 'ProfileCtrl',
    controllerAs: 'profile',
    bindToController: {
      library: '='
    },
    templateUrl: '/app/shared/templates/show-library.html',
    link: link
  };
};

function tradeOptions() {

  function link(scope,element) {
    scope.$watch('search.trading',function(newVal) {
      console.log("watching search.trading, which is now " + scope.search.trading)
      if (newVal == null) {
        $(element).hide();
      }
      else {
        $(element).show();
      }
    });
  }

  return {
    restrict: 'A',
    controller: 'SearchCtrl',
    controllerAs: 'search',
    bindToController: true,
    templateUrl: '/app/shared/templates/trade-options.html',
    scope: false,
    link: link
  };
};

angular
.module('book-app')
.directive('allBooks', allBooks)
.directive('dialogAddBook', dialogAddBook)
.directive('dialogSearchResults', dialogSearchResults)
.directive('removeBook', removeBook)
.directive('reviewTrade', reviewTrade)
.directive('showBorrowed', showBorrowed)
.directive('showLibrary', showLibrary)
.directive('tradeOptions', tradeOptions)
