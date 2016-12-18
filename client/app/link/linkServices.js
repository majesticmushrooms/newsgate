angular.module('link.services', [])
.factory('LinkFactory', function($http) {
  var getLinks = function () {
    return $http({
      method: 'GET',
      url: 'http://localhost:8000/api/links' //i'm using the escape option for server 
    }, function(response) {
      return response;
    })
  }

  var sendLinks = function () {
    return $http({
      method: 'POST',
      url: 'http://localhost:8000/api/links', //i'm using the escape option for server 
      data: {url: 'https://github.com/'},
      dataType: 'json'
    }, function(response) {
      return response;
    })
  }

  var login = function () {
  }  

  return {
    getLinks: getLinks,
    sendLinks: sendLinks, 
    login: login
  }
})
