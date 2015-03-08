'use strict';

angular.module('prosperenceApp')
.controller('UniversityCtrl', ['$scope', '$rootScope', '$state', 'search', 'Auth',  function($scope, $rootScope, $state, search, Auth) {
  $scope.facetFields = "";
  $scope.filterFields = "";
  $scope.selectedItems = [];
  $scope.from = 0;
  $scope.page = 1;
  $scope.prevPage = 1;
  $scope.noOfSuggests = 5;
  $scope.checked = [];
  $scope.filterFields = [];
  $scope.searchInProgress = true;
  $scope.clickLimit = 5;
  $scope.showMoreFacets = true;
  $scope.startMinutesFilter = 0;
  $scope.endMinutesFilter = 0;
  $scope.$state = $state;

  $scope.currentUser = Auth.getCurrentUser();

  $scope.toggleFavorite = function(youtubeId) {
    $scope.currentUser.university = $scope.currentUser.university || {};
    $scope.currentUser.university.favorites = $scope.currentUser.university.favorites || {};

    $scope.currentUser.university.favorites[youtubeId] = !$scope.currentUser.university.favorites[youtubeId];
  };

  $scope.doSearch = function (searchTerm, pageNumber, filterFields) {
    pageNumber = pageNumber || 0;
    filterFields = filterFields || null;
    $scope.searchTerm = searchTerm;
    search.doSearch(searchTerm, pageNumber, filterFields, null, function (newCourses) {
      newCourses = search.processFacets(newCourses);
      $rootScope.$broadcast('courses-updated', {
        newCourses: newCourses
      });
    });
  };

  $scope.doSuggestor = function(searchTerm) {
    $scope.searchTerm = searchTerm;
    search.doSuggestor(searchTerm, function(newCourses) {
      $scope.suggestedCourses = newCourses;
    });
  };

  // Search by facet filter.
  $scope.doSearchByFilter = function(term, value) {
    $scope.checked[value] = !$scope.checked[value];

    if($scope.checked[value]) {
      $scope.filterFields.push({
        term: term,
        value: value
      });
    } else {
      $scope.filterFields.forEach(function(filter, i) {
        if(filter.value === value) {
          $scope.filterFields.splice(i, 1);
        }
      })
    }

    $scope.doSearch($scope.searchTerm, 0, $scope.filterFields);
  };

  // Function to sort by minutes
  $scope.doMinutesSort = function() {
    //remove existing minutes filter, if exists
    $scope.filterFields.forEach(function(filter, i) {
      if(filter.term === 'duration') {
        $scope.filterFields.splice(i, 1);
      }
    });

    // filter by minutes range
    $scope.doSearchByFilter('duration', '[' + ($scope.startMinutesFilter * 60) + ',' + ($scope.endMinutesFilter * 60) + ']');
  };

  //ajax call to show more favorite records
  $scope.showMoreFacetLinks = function(numberToShow) {
    // toggle to "Show Less"
    $scope.showMoreFacets = false;

    // set limit filter for ng-repeat
    $scope.clickLimit = numberToShow;
  };

  //ajax call to show less favorite records
  $scope.showLessFacetLinks = function() {
    // toggle to "Show More"
    $scope.showMoreFacets = true;

    // set limit filter for ng-repeat
    $scope.clickLimit = 5;
  };

  //INIT
  //initially, if courses empty, then call search to show items
  $scope.doSearch('', 0, function(newCourses) {
    $scope.courses = newCourses;
  });

  //listen for courses-updated event, which is broadcasted from navbar.controller.js
  $scope.$on('courses-updated', function(event, args) {
    $scope.courses = args.newCourses;
    $scope.searchInProgress = false;
  });

  $scope.$on('search-in-progress', function(event, args) {
    $scope.courses.results = [];
    $scope.courses.totalCount = 0;
    $scope.searchInProgress = true;
  });

  //when enter pressed, trigger search if no suggestions given
  $rootScope.$on('keypress', function(onEvent, keypressEvent) {
    var keyCode = keypressEvent.which;

    if(keyCode === 13 && $scope.searchTerm) {
      $scope.doSearch($scope.searchTerm);
    }
  });
}]);
