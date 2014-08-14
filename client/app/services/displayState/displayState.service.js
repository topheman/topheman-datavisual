'use strict';

angular.module('tophemanDatavizApp')
  .service('displayState', function () {
    //whether it is collapsed or not
    return {
      pieChannel : true,
      lastTweets : false,
      barChartChannel : false,
      packChartChannels : false,
      treeChartChannels : true
    };
  });
