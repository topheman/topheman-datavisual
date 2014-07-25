var TwitterStreamChannels;

var TwitterStreamManager = function(options){
  this.options = options;
  this.client;
  this.stream;
  this.streamTimeStamp;
  if(this.options.mock === "true"){
    console.log('using twitter-stream-channels mocked');
    //@todo specify a file for mock via options.tweets and options.singleRun = false
    options.singleRun = false;
    TwitterStreamChannels = require('../../../../twitter-stream-channels/main').getMockedClass();
  }
  else{
    console.log('using twitter-stream-channels real');
    TwitterStreamChannels = require('../../../../twitter-stream-channels/main');
  }
  this.client = new TwitterStreamChannels(options);
};

TwitterStreamManager.prototype.getDescriptionChannels = function(){
  if(this.options.mock === "true"){
    return require('../../config/channelsDescription.mock.json');
  }
  else{
    return require('../../config/channelsDescription.json');
  }
};

TwitterStreamManager.prototype.getStreamChannelsTrackOptions = function(){
  var that = this;
  if(typeof this.streamChannelsTrackOptions !== 'undefined'){
    return this.streamChannelsTrackOptions;
  }
  else{
    this.streamChannelsTrackOptions = {};
    this.getDescriptionChannels().forEach(function(item){
      that.streamChannelsTrackOptions[item.channelName] = item.track;
    });
    return this.streamChannelsTrackOptions;
  }
};

TwitterStreamManager.prototype.launch = function(callback){
  console.log('launch');
  //@todo should handle a relaunch withouch calling callback
  this.stream = this.client.streamChannels({track:this.getStreamChannelsTrackOptions()});
  this.streamTimeStamp = (new Date()).getTime();
  callback.call({},this.stream);
};

TwitterStreamManager.prototype.getStream = function(){
  return this.stream;
};

TwitterStreamManager.prototype.getStreamTimeStamp = function(){
  return this.streamTimeStamp;
};

module.exports = TwitterStreamManager;