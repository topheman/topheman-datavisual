'use strict';

angular.module('tophemanDatavizApp')
  .controller('ChannelCtrl', function ($scope, $routeParams, persistance, displayState) {
    $scope.channel = persistance.getData().channels[$routeParams.channel];
    $scope.channelDescription = persistance.getData().channelsDescription[$routeParams.channel];
    $scope.displayState = displayState;
  });
