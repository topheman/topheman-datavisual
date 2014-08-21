'use strict';

// Development specific configuration
// ==================================
module.exports = {
//  twitterStreamTimeout : 500000,//2mins
  socketMaxAge : 300000,//5min
  socketMaxAgeAlertBefore : 290000,
  cleanSocketsDelay : 60000,//1min
  mock : true,
  mockTweetDelay : 200
};
