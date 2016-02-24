var app = angular.module('ng-people',[]);

app.controller('PeopleController',['$scope','$http', function($scope, $http) {

  $scope.editing = false;
  var addressObj;

  var url = 'http://127.0.0.1:8080/';

  var address = function(obj) {
    $scope.street = obj.street;
    $scope.city = obj.city;
    $scope.state = obj.state;
    $scope.postal = obj.postal;
    $scope.country = obj.country;
  };

  var getUser = function() {
    $http.get(url + 'api/:id')
      .then(function(response) {

        $scope.user = response.data.github.username;
        $scope.display = response.data.github.displayName;
        $scope.books = response.data.books;
        addressObj = response.data.address;

        address(addressObj);

      });
  };

  getUser();

  $scope.startEdit = function() {
    $scope.editing = true;
  };

  $scope.finishEdit = function() {
    var q = 'update/?addr=true&street=' + $scope.street + '&city=' + $scope.city;
    q += '&state=' + $scope.state + '&postal=' + $scope.postal + '&country=' + $scope.country;

    q = q.replace(/ /g,'+');
    q = q.replace(/,/g,'');
    q = q.match(/[\w\+=&?]/g);
    q = q.join('');

    $http.post(url + q)
      .then(function(response) {
        address(response.data.address);
        $scope.editing = false;
    });
  };

}]);
