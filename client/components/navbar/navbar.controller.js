'use strict';

angular.module('prosperenceApp')
  .controller('NavbarCtrl', function($scope, $state, $location, Auth) {

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.menu = [{
      'title': 'Home',
      'link': 'main',
      'shown': true
    }, {
      'title': 'About',
      'link': 'about',
      'shown': true
    }, {
      'title': 'My Plan',
      'link': 'my-plan',
      'shown': 'isLoggedIn()'
    }, {
      'title': 'Start Planning',
      'link': 'plan-builder.start',
      'shown': '!isLoggedIn()',
      'abstractLink': 'plan-builder'
    }, {
      'title': 'University of Prosperence',
      'class': 'fa fa-graduation-cap',
      'link': 'university.welcome',
      'shown': true,
      'abstractLink': 'university'
    }, ];

    $scope.logout = function() {
      Auth.logout();
      $location.path('/');
    };

        // Sets active class on sidebar.
    $scope.isActive = function(viewLocation) {
      return $state.includes(viewLocation);
    };
  });
