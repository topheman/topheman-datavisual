'use strict';

angular.module('tophemanDatavizApp')
  .controller('MainCtrl', function ($scope, persistance) {
    
    $scope.data = persistance.getData();
    $scope.channelsDescription = persistance.getChannelsDescription();
    
  });