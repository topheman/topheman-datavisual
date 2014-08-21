/**
 * The only purpose of this directive is to debug/help in development of change of state
 * It also injects to methods on the global window object :
 * - switchSocketState()
 * - switchTwitterState()
 */
'use strict';

angular.module('tophemanDatavizApp')
        .directive('debugState', function(persistance, $window) {

          return {
            template: '<p><button ng-click="switchSocketState()">socket : {{state.socket}}</button>&nbsp;<button ng-click="switchTwitterState()">twitter : {{state.twitter}}</button>&nbsp<button ng-click="inactiveSocket()">trigger inactivity</button></p>',
            restrict: 'E',
            scope : false,
            link: function(scope, element, attrs) {
              scope.state = persistance.getState();
              var switchSocketState = persistance._debug.state.switchSocketState;
              var switchTwitterState = persistance._debug.state.switchTwitterState;
              var inactiveSocket = persistance._debug.state.inactiveSocket;
              scope.switchSocketState = switchSocketState;
              scope.switchTwitterState = switchTwitterState;
              scope.inactiveSocket = inactiveSocket;
              $window.switchSocketState = switchSocketState;
              $window.switchTwitterState = switchTwitterState;
              $window.inactiveSocket = inactiveSocket;
            }
          };
        });