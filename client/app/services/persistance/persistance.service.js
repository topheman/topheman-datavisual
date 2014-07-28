'use strict';

angular.module('tophemanDatavizApp')
        .service('persistance', function(socketFactory, $rootScope) {
  
          var STATE_DISCONNECTED = 'disconnected';
          var STATE_CONNECTING = 'connecting';
          var STATE_CONNECTED = 'connected';
          
          var _socket = socketFactory();
          var _data = {
            count : 0
          };
          var _channelsDescription = [];
          var _state = {
            socket : STATE_DISCONNECTED,
            twitter : STATE_DISCONNECTED
          };
          
          //once the client connected
          _socket.on('connected',function(msg){
            console.log('connected',msg);
            _channelsDescription = msg.channelsDescription;
            _state.socket = STATE_CONNECTED;
            _state.twitter = msg.twitterState;
          });
          
          //event emitted from the server when a client has been inactive too long
          _socket.on('inactive-socket',function(msg){
            console.warn(msg.msg, "Inactive for "+msg.timeout+"ms");
            _socket.disconnect();
          });
          
          //events to keep track of the state of the twitter stream on the server behing the websocket
          _socket.on('twitter:connect',function(msg){
            console.log('twitter:connect',msg);
            _state.twitter = msg.twitterState;
          });
          _socket.on('twitter:connected',function(msg){
            console.log('twitter:connected',msg);
            _state.twitter = msg.twitterState;
          });
          _socket.on('twitter:disconnect',function(msg){
            console.log('twitter:disconnect',msg);
            _state.twitter = msg.twitterState;
          });
          
          //update on each postprocessed tweet
          _socket.on('data',function(msg){
            console.log('tweet',msg.text);
            _data.count++;
          });

          var getData = function() {
            return _data;
          };

          var getChannelsDescription = function() {
            return _channelsDescription;
          };

          var getState = function() {
            return _state;
          };

          var getSocket = function() {
            return _socket;
          };

          return {
            getSocket : getSocket,
            getData: getData,
            getState: getState,
            getChannelsDescription: getChannelsDescription
          };

        });
