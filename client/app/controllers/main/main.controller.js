'use strict';

angular.module('tophemanDatavizApp')
  .controller('MainCtrl', function ($scope, socket) {
    $scope.awesomeThings = [{
      name : "world",
      info : "hello"
    }];
    
    $scope.data = socket.getData();
    
  });