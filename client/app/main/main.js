angular.module('newsgate.main', [])
.controller('MainController', function($scope, $rootScope, $window) {
  $scope.isLoaded = false;

  $rootScope.$on('updateData', () => {
    $scope.isLoaded = true;
  });
  $scope.login = function() {
    console.log('in login');
    $window.location.href = 'http://localhost:8000/login/facebook'
  }
});
