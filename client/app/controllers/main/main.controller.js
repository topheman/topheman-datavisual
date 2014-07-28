'use strict';

angular.module('tophemanDatavizApp')
  .controller('MainCtrl', function ($scope, persistance) {
    $scope.awesomeThings = [{
      name : "world",
      info : "hello"
    }];
    
    $scope.data = persistance.getData();
    
  });