'use strict';

angular.module('tophemanDatavizApp')
  .controller('MainCtrl', function ($scope, $http, tweets) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

  });