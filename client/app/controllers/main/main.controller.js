'use strict';

angular.module('tophemanDatavizApp')
  .controller('MainCtrl', function ($scope, persistance, displayState) {
    
    $scope.channelsDescription = persistance.getData().channelsDescription;
    $scope.data = persistance.getData();
    $scope.displayState = displayState;
    //only for debug of the notification directive - todo make a directive for it
    $scope.state = persistance.getState();
    $scope.switchSocketState = persistance._debug.state.switchSocketState;
    
  });