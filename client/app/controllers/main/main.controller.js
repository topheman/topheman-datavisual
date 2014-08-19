'use strict';

angular.module('tophemanDatavizApp')
  .controller('MainCtrl', function ($scope, persistance, displayState) {
    
    $scope.channelsDescription = persistance.getData().channelsDescription;
    $scope.data = persistance.getData();
    $scope.displayState = displayState;
    $scope.state = persistance.getState();
    $scope.switchSocketState = persistance._debug.state.switchSocketState;
    $scope.$watch('state',function(newVal,oldVal){
      console.log('main',newVal,oldVal);
    });
    
  });