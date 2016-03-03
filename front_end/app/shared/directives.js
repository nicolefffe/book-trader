function dialogAddBook() {

  function link($scope,element) {
    $scope.$watch('search.bookAdded', function(newVal) {
      console.log(newVal);
      if (newVal == null) {
        console.log('closing dialog');
        $(element).hide();
      }
      else {
        console.log('showing dialog');
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

  function link($scope,element) {
    $scope.$watch('search.results',function(newVal) {
      console.log(newVal);
      if (newVal == null) {
        console.log('closing dialog');
        $(element).hide();
      }
      else {
        console.log('showing dialog');
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

angular
.module('book-app')
.directive('dialogAddBook', dialogAddBook)
.directive('dialogSearchResults', dialogSearchResults);
