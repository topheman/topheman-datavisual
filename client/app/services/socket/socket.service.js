'use strict';

angular.module('tophemanDatavizApp')
        .service('socket', function() {
  
          var STATE_DISCONNECTED = 'disconnected';
          var STATE_CONNECTING = 'connecting';
          var STATE_CONNECTED = 'connected';

          var socket;
          var data = [];
          var channelsDescription;

          var state = {
            socket : STATE_DISCONNECTED,
            twitter : STATE_DISCONNECTED
          };

          function initSocket() {
            socket = io();
            socket.on('connected',function(data){
              console.log('connected',data);
              state.socket = STATE_CONNECTED;
              state.twitter = data.twitterState;
            });
            socket.on('data',function(data){
              console.log('tweet',data.text);
            });
            socket.on('inactive-socket',function(data){
              console.log(data.msg);
              socket.disconnect();
            });
          }
          console.log('initSocket');
          initSocket();

          var getData = function() {
            return data;
          };

          var getChannelsDescription = function() {
            return channelsDescription;
          };

          var getState = function() {
            return state;
          };

          return {
            getData: getData,
            getState: getState,
            getChannelsDescription: getChannelsDescription
          };

        });
