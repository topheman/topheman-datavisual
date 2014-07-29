'use strict';

angular.module('tophemanDatavizApp')
        .service('persistance', function(socketFactory, $rootScope, $q) {
          
          var deferred = $q.defer();
  
          var STATE_DISCONNECTED = 'disconnected';
          var STATE_CONNECTING = 'connecting';
          var STATE_CONNECTED = 'connected';
          
          var lastTweetsMaxlength = 10;
          
          var _socket = socketFactory();
          var _data = {
            count : 0,
            channels:{},
            channelsDescription : []
          };
          var _state = {
            socket : STATE_DISCONNECTED,
            twitter : STATE_DISCONNECTED
          };
          
          //once the client connected
          _socket.on('connected',function(msg){
            console.log('connected',msg);
            deferred.resolve('init');
            _data.channelsDescription = msg.channelsDescription;
            _initData();
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
            var channelId, i, keyword;
//            console.log(msg.text);
            //feed channels infos
            for(channelId in msg.$channels){
              _data.channels[channelId].count++;
              _data.channels[channelId].lastTweets = [msg].concat(_data.channels[channelId].lastTweets);
              if(_data.channels[channelId].lastTweets.length > lastTweetsMaxlength){
                _data.channels[channelId].lastTweets.pop();
              }
              for(i=0; i<msg.$channels[channelId].length; i++){
                if(typeof _data.channels[channelId].keywords[msg.$channels[channelId][i]] === 'undefined'){
                  _data.channels[channelId].keywords[msg.$channels[channelId][i]] = {
                    count:0,
                    name : msg.$channels[channelId][i]
                  };
                }
                _data.channels[channelId].keywords[msg.$channels[channelId][i]].count++;
              }
            }
            _data.count++;
          });
          
          var _initData = function(){
            var channelId;
            for(channelId in _data.channelsDescription){
              _data.channels[channelId] = {
                lastTweets : [],
                keywords : {},
                count : 0
              };
            }
          };

          var getData = function() {
            return _data;
          };

          var getState = function() {
            return _state;
          };
          
          var getSocket = function() {
            return _socket;
          };
          
          /**
           * Returns a promise to use in a route resolver to be sure not to launch some controllers that should have socket connection init before their creation
           * @returns {$q.promise}
           */
          var isInit = function() {
            return deferred.promise;
          };

          return {
            getSocket : getSocket,
            getData: getData,
            getState: getState,
            isInit : isInit
          };

        });
