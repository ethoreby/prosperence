'use strict';

angular.module('prosperenceApp')
.controller('FavoritesCtrl', function($scope) {
  $scope.isFavorite = function(youtubeId) {
    debugger;
    return function(course) {
      debugger;
      return $scope.currentUser.university.favorites[youtubeId];
    };
  };

});
