'use strict';

angular.module('tophemanDatavizApp')
        .service('socket', function() {

          var socket;
          var data = [];
          var channelsDescription;

          var state = {
            iddle: true,
            connecting: false,
            connected: false
          };

          function initSocket() {
            socket = io();
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
