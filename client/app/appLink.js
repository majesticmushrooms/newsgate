angular.module('link', ['link.services', 'link.controllers', 'ngRoute'])
.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: '/app/link/home.html',
    controller: 'HomeController'
  })
})

