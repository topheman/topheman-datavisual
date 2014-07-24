var SocketsManager = require('./sockets/SocketsManager');
var TwitterStreamManager = require('./sockets/TwitterStreamManager');

module.exports.launch = function(io){
  var twitterStreamManager = new TwitterStreamManager({
    "consumer_key": process.env.consumer_key,
    "consumer_secret": process.env.consumer_secret,
    "access_token": process.env.access_token,
    "access_token_secret": process.env.access_token_secret,
    "mock": process.env.mock
  });
  var socketsManager = new SocketsManager(io,twitterStreamManager);
};