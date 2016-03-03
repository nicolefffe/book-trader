function dialogAddBook() {

  // Display element if a book has been added to a user's library

  function link(scope,element) {
    scope.$watch('search.bookAdded', function(newVal) {
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
    templateUrl: '/app/shared/dialog-add-book.html',
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
    templateUrl: '/app/shared/dialog-search-results.html',
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
.directive('dialogAddBook', dialogAddBook)
.directive('dialogSearchResults', dialogSearchResults)
.directive('removeBook', removeBook);
