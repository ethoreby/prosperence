'use strict';

angular.module('prosperenceApp')
.controller('FavoritesCtrl', function($scope) {

  //TODO suspect filtering is affected by how videos populated. May not work until resolved.
  $scope.isFavorite = function(youtubeId) {
    return function(course) {
      return $scope.currentUser.university.favorites[youtubeId];
    };
  };


});
