'use strict';

angular.module('tophemanDatavizApp')
  .service('displayState', function () {
    //whether it is collapsed or not
    return {
      pieChannel : false,
      lastTweets : true
    };
  });
