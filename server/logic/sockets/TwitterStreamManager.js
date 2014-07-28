var TwitterStreamChannels;
var config = require('../../config/environment');
var twitterStreamTimeout = config.twitterStreamTimeout;

var TwitterStreamManager = function(options){
  this.options = options;
  this.client;
  if(this.options.mock === true){
    console.log('using twitter-stream-channels MOCKED');
    //@todo specify a file for mock via options.tweets and options.singleRun = false
    options.singleRun = false;
    options.tweetDelay = config.mockTweetDelay;
    TwitterStreamChannels = require('../../../../twitter-stream-channels/main').getMockedClass();
  }
  else{
    console.log('using twitter-stream-channels REAL ONLINE');
    TwitterStreamChannels = require('../../../../twitter-stream-channels/main');
  }
  this.client = new TwitterStreamChannels(options);
};

/**
 * Returns the description of the channels to pass on to the front
 * @returns {Object}
 */
TwitterStreamManager.prototype.getDescriptionChannels = function(){
  if(this.options.mock === true){
    return require('../../config/channelsDescription.mock.json');
  }
  else{
    return require('../../config/channelsDescription.json');
  }
};

/**
 * Returns a channels object to feed to the track parameter of TwitterStreamChannels.streamChannels
 * @returns {Object}
 */
TwitterStreamManager.prototype.getStreamChannelsTrackOptions = function(){
  var that = this;
  if(typeof this.streamChannelsTrackOptions !== 'undefined'){
    return this.streamChannelsTrackOptions;
  }
  else{
    this.streamChannelsTrackOptions = {};
    this.getDescriptionChannels().forEach(function(item,i){
      that.streamChannelsTrackOptions[i] = item.track;
    });
    return this.streamChannelsTrackOptions;
  }
};

/**
 * Beware : stop your streams before calling this function
 * @param {Function} initCallback called immediatly after launch
 * @param {Function} timeoutCallback called after twitterStreamTimeout ms (in order to reopen a Twitter stream only if there are still websockets opened)
 * @returns {Boolean}
 */
TwitterStreamManager.prototype.launch = function(initCallback,timeoutCallback){
  var that = this;
  this._stream = this.client.streamChannels({track:this.getStreamChannelsTrackOptions()});
  console.log('>.streamChannels() called - twitter should be requested anytime');
  if(typeof initCallback === 'function'){
    initCallback.call({},this._stream);
  }
  //scheddle the timeout callback when the stream should close - in order to let the socket layer check if there is still someone listening
  if(typeof timeoutCallback === 'function'){
    setTimeout((function(currentStream){
      return function(){
        timeoutCallback.call({},currentStream);
      };
    })(that._stream),twitterStreamTimeout);
  }
};

module.exports = TwitterStreamManager;