var TwitterStreamManager = function(options){
  this.options = options;
};

TwitterStreamManager.prototype.getDescriptionChannels = function(){
  if(this.options.mock === true){
    return require('../../config/channelsDescription.mock.json');
  }
  else{
    return require('../../config/channelsDescription.json');
  }
};

TwitterStreamManager.prototype.getStreamChannelsOptions = function(){
  if(typeof this.streamChannelsOptions !== 'undefined'){
    return this.streamChannelsOptions;
  }
  else{
    this.streamChannelsOptions = {};
    this.getDescriptionChannels().forEach(function(item){
      this.streamChannelsOptions[item.channelName] = item.track;
    });
    return this.streamChannelsOptions;
  }
};

module.exports = TwitterStreamManager;