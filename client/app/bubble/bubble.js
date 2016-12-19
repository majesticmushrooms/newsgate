angular.module('newsgate.bubble', [])
.controller('BubbleController', function($scope, $rootScope, Data, Response) {
  $scope.data = Data.keywords.keywords;

  $rootScope.$on('updateData', () => {
    $scope.data = Data.keywords.keywords[0];
    console.log('CLIENT: updated keywords ->', $scope.data);
  });


})
.directive('bubbleChart', function() {
  return {
    restrict: 'E',
    scope: { data: '='},
    template: "<div ng-repeat='keywords in data | limitTo:5'><center><b>{{keywords.text.toUpperCase()}}</b></center>&nbsp</div>"
    };
});
