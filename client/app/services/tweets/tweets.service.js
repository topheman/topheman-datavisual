'use strict';

angular.module('tophemanDatavizApp')
  .service('tweets', function transport() {
    
    var tweets = [];
    var socket;
    
    function initSocket(){
      socket = io();
    }
    console.log('initSocket');
    initSocket();
    
  });
