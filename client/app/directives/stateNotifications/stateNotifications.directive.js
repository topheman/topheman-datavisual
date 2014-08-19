'use strict';

angular.module('tophemanDatavizApp')
        .directive('stateNotifications', function(persistance) {

          return {
            template: '',
            restrict: 'E',
            scope: {
              state: '='
            },
            link: function(scope, element, attrs) {
              scope.$watch('state', function(newVal, oldVal) {
                console.log('state', newVal, oldVal);
              }, true);
            }
          };
        });