'use strict';

angular.module('prosperenceApp')
.controller('FavoritesCtrl', function($scope) {
  $scope.isFavorite = function(youtubeId) {
    return function(course) {
      return $scope.currentUser.university.favorites[youtubeId];
    };
  };


});
