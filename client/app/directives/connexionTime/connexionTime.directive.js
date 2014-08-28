'use strict';

angular.module('tophemanDatavizApp')
        .directive('connexionTime', function(persistance, $timeout) {

          return {
            template: 'Connexion time : <span>{{timeElapsed | ttl}} </span><span class="label label-success" ng-show="connected">connected</span><span class="label label-warning" ng-show="!connected">disconnected</span>',
            restrict: 'E',
            scope: false,
            link: function(scope, element, attrs) {

              scope.state = persistance.getState();
              scope.connected = false;

              var timer = null;

              var updateTimeElapsed = function() {
                if (scope.connected === true) {
                  scope.timeElapsed = scope.state.connexionTime.previousTimeElapsed + (new Date()).getTime() - scope.state.connexionTime.currentStartTime;
                  timer = $timeout(updateTimeElapsed, 1000);
                }
                else {
                  $timeout.cancel(timer);
                }
              };

              scope.$watch('state.connexionTime', function(newVal, oldVal) {
                console.log('state.twitter', newVal, oldVal);
                if (newVal.connected === true) {
                  scope.connected = true;
                }
                else if (newVal.connected === false) {
                  scope.connected = false;
                }
                updateTimeElapsed();
              }, true);

            }
          };
        })
        .filter('ttl', function() {
          //inspired by https://coderwall.com/p/wkdefg
          return function(duration) {
            var milliseconds = parseInt((duration % 1000) / 100)
                    , seconds = parseInt((duration / 1000) % 60)
                    , minutes = parseInt((duration / (1000 * 60)) % 60)
                    , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;

//            return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
            return minutes + ":" + seconds;
          };
        });