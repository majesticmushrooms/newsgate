angular.module('link', ['link.services', 'link.controllers', 'ngRoute'])
.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: '/app/views/home.html',
    controller: 'HomeController'
  })
})

