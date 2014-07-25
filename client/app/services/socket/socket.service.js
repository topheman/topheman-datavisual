'use strict';

angular.module('tophemanDatavizApp')
        .service('socket', function() {

          var socket;
          var data = [];
          var channelsDescription;

          var state = {
            disconneted: true,
            connecting: false,
            connected: false,
            twitter: {
              disconneted: true,
              connecting: false,
              connected: false
            }
          };

          function initSocket() {
            socket = io();
            socket.on('connected',function(data){
              console.log('connected',data);
            });
            socket.on('data',function(data){
              console.log('tweet',data.text);
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
