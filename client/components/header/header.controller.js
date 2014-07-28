'use strict';

angular.module('tophemanDatavizApp')
  .controller('HeaderCtrl', function ($scope,$location,socket) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];
  
    socket.getSocket().on('connected',function(){
  
      $scope.channelsMenu = socket.getChannelsDescription().map(function(item,i){
        return {
          'title' : item.title,
          'link' : '/category/'+i
        };
      });
      
    });
    

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
