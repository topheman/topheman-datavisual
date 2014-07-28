'use strict';

angular.module('tophemanDatavizApp')
        .service('socket', function(socketFactory, $rootScope) {
  
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
          
          /**
           * Safe $rootScope.$apply which check for $apply or $digest phase before
           * 
           * @param {Function} fn
           * @returns {undefined}
           */
          var rootScopeSafeApply = function(fn) {
            var phase = $rootScope.$$phase;
            if (phase === '$apply' || phase === '$digest') {
              if (fn && (typeof (fn) === 'function')) {
                fn();
              }
            } else {
              $rootScope.$apply(fn);
            }
          };
          
          _socket.on('connected',function(msg){
            console.log('connected',msg);
            _channelsDescription = msg.channelsDescription;
            _state.socket = STATE_CONNECTED;
            _state.twitter = msg.twitterState;
          });
          _socket.on('data',function(msg){
            console.log('tweet',msg.text);
            _data.count++;
          });
          _socket.on('inactive-socket',function(msg){
            console.warn(msg.msg);
            _socket.disconnect();
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
