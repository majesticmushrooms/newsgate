angular.module('newsgate.submit', [])
.controller('SubmitController', function($scope, $rootScope, Response, State, $http) {
  $scope.hideSpinner = State.hideSpinner;
  // Invoke get request to server
  $scope.sendLink = function() {
    console.log('Getting Link:', $scope.inputLink);
    Response.sendLink($scope.inputLink);
  }

  $scope.saveLink = function() {
    console.log('Saving Link:', $scope.inputLink);
    Response.saveLink($scope.inputLink);
  }
  $scope.inputLink = location.search.substring(1);
  $scope.sendLink();

  $scope.login = function() {
    console.log('Saving Link:', $scope.inputLink);
    Response.loginFB();
    // $http.get('http://localhost:8000/')
    // .then((res) => {
    //   console.log(res)
    // })
  }

  $rootScope.$on('updateSpinner', function() {
    console.log('updating spinner!');
    $scope.hideSpinner = State.hideSpinner;
  });
});
