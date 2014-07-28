var SocketsManager = require('./sockets/SocketsManager');
var TwitterStreamManager = require('./sockets/TwitterStreamManager');
var config = require('../config/environment');

module.exports.launch = function(io){
  console.log('mock',process.env.mock);
  var twitterStreamManager = new TwitterStreamManager({
    "consumer_key": process.env.consumer_key,
    "consumer_secret": process.env.consumer_secret,
    "access_token": process.env.access_token,
    "access_token_secret": process.env.access_token_secret,
    "mock": config.mock
  });
  var socketsManager = new SocketsManager(io,twitterStreamManager);
};