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
      element.parent().remove();
    });
  }

  return {
    restrict: 'A',
    scope: {},
    link: link
  };
};

angular
.module('book-app')
.directive('allBooks', allBooks)
.directive('dialogAddBook', dialogAddBook)
.directive('dialogSearchResults', dialogSearchResults)
.directive('removeBook', removeBook);
