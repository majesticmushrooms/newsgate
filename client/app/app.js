angular.module('newsgate', [
  'newsgate.services',
  'newsgate.main',
  'newsgate.titlebar',
  'newsgate.submit',
  'newsgate.trends',
  'newsgate.bubble',
  'newsgate.tweets',
  'newsgate.nav',
  'newsgate.reportcard',
  'ngRoute'
])
.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    // leave this empty
  })
  .when('/main', {
    templateUrl: 'app/main/main.html'
  })
  .when('/trends', {
    templateUrl : 'app/trends/trends.html',
    controller: 'TrendsController'
  })
  .when('/bubble', {
    templateUrl : 'app/bubble/bubble.html',
    controller: 'BubbleController'
  })
  .when('/tweets', {
    templateUrl : 'app/tweets/tweets.html',
    controller: 'TweetsController'
  });
})
.run(['$anchorScroll', function($anchorScroll) {
  $anchorScroll.yOffset = 50;
}]);
