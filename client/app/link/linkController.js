angular.module('link.controllers', ['link.services'])
.controller('HomeController', function($scope, LinkFactory, $location, $window) {
  $scope.starter = 'hi from link controller!';
  $scope.showlink = false
  $scope.showkeyword = true
  $scope.link = [];
  $scope.filteredLinks = [];
  //s$scope.showfiltered = false; 
  $scope.getLinks = function() {
    LinkFactory.getLinks().then(response => {
      console.log(response.data.link)
      $scope.linksNum = response.data.link.length;
      $scope.links = response.data.link;
      $scope.keywords = response.data.link.map(link => {
        return link.keywords
      })
      $scope.keywords = [].concat.apply([], $scope.keywords)
      console.log($scope.keywords)
    }) 
  }
  $scope.filterByKeyword = function (keyword) {
    console.log(keyword);
    $scope.filteredLinks = $scope.links.filter(link=> {
      var linkKeywordArr = link.keywords.map(linkkeyword => linkkeyword.text);
      return linkKeywordArr.indexOf(keyword.text) > -1
    });
    $scope.showfiltered  = true;
  }

  $scope.goToLink = function (url) {
    $window.location.href = url
  }

  $scope.showKeywords = function () {
    $scope.showlink = false;
    $scope.showkeyword = true;   
  }

  $scope.showLinks = function() {
    $scope.showlink = true;
    $scope.showkeyword = false;      
  }

  $scope.login = function () {
    $window.location.href = 'http://localhost:8000/login/facebook'
  }
  $scope.getLinks();
})


  