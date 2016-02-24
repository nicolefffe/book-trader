var app = angular.module('ng-people',[]);

app.controller('PeopleController',['$scope','$http', function($scope, $http) {

  $scope.user = '';
  $scope.display = '';
  $scope.address = '';
  $scope.editing = false;

  var url = 'http://127.0.0.1:8080/';

  var getUser = function() {
    $http.get(url + 'api/:id')
      .then(function(response) {

        $scope.user = response.data.github.username;
        $scope.display = response.data.github.displayName;
        $scope.address = response.data.address;
        $scope.books = response.data.books;

      });
  };

  $scope.startEdit = function() {
    $scope.editing = true;
  };

  $scope.finishEdit = function() {
    var q = 'find/users/?addr=';

    var newAddress = $scope.address;
    newAddress = newAddress.replace(/ /g,'+');

    $http.post(url + q + newAddress)
      .then(function(response) {
        $scope.address = response.data.address;
        $scope.editing = false;
    });
  };

  getUser();

}]);
