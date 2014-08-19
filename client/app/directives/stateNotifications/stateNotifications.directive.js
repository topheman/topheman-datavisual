'use strict';

angular.module('tophemanDatavizApp')
  .directive('stateNotifications', function () {
    
    return {
      template: '',
      restrict: 'E',
      scope : {
        state : '='
      },
      link: function(scope, element, attrs){
        console.log('init stateNotifications',scope.state);
        scope.$watch('state',function(newVal,oldVal){
          console.log('state',newVal,oldVal);
        });
        scope.$watch('state',function(newVal,oldVal){
          console.log('state',newVal,oldVal);
        });
      }
    };
  });