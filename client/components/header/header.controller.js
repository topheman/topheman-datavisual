'use strict';

angular.module('tophemanDatavizApp')
  .controller('HeaderCtrl', function ($scope,$location,persistance) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];
  
    persistance.getSocket().on('connected',function(){
  
      $scope.channelsMenu = persistance.getData().channelsDescription.map(function(item,i){
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
