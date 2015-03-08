'use strict';

angular.module('prosperenceApp')
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.when('/university', '/university/welcome');

  $stateProvider
  .state('university', {
    url: '/university',
    templateUrl: 'app/university/university.html',
    controller: 'UniversityCtrl',
    abstract: true
  })
  .state('university.courses', {
    url: '/courses',
    templateUrl: 'app/university/courses/courses.html',
    controller: 'CoursesCtrl'
  })
  .state('university.favorites', {
    url: '/favorites',
    templateUrl: 'app/university/favorites/favorites.html',
    controller: 'FavoritesCtrl'
  })
  .state('university.recommended', {
    url: '/recommended',
    templateUrl: 'app/university/courses/courses.html',
    controller: 'RecommendedCtrl'
  })
});
