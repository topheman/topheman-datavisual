'use strict';

angular.module('tophemanDatavizApp')
  .controller('ChannelCtrl', function ($scope, $routeParams, persistance, displayState) {
    $scope.channel = persistance.getData().channels[$routeParams.channel];
    $scope.channelDescription = persistance.getChannelsDescription()[$routeParams.channel];
    $scope.displayState = displayState;
  });
