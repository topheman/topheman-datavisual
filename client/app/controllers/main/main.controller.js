'use strict';

angular.module('tophemanDatavizApp')
        .controller('MainCtrl', function($scope, persistance, displayState) {

          $scope.channelsDescription = persistance.getData().channelsDescription;
          $scope.data = persistance.getData();
          $scope.displayState = displayState;

        });