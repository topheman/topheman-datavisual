'use strict';

angular.module('tophemanDatavizApp')
  .controller('HeaderCtrl', function ($scope,$location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
