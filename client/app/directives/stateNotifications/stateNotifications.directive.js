'use strict';

angular.module('tophemanDatavizApp')
        .directive('stateNotifications', function(persistance, growl) {

          return {
            template: '<div growl limit-messages="6"></div>',
            restrict: 'E',
            scope: false,
            link: function(scope, element, attrs) {
              
              scope.state = persistance.getState();
              scope.socketMaxAgeInfos = persistance.getSocketMaxAgeInfos();

              scope.$watch('state.twitter', function(newVal, oldVal) {
                console.log('state.twitter', newVal, oldVal);
                if(newVal !== oldVal){
                  if(newVal === 'disconnected'){
                    growl.warning("Server has disconnected from Twitter stream, trying to reconnect ...");
                  }
                  if(newVal === 'connected'){
                    growl.success("Server successfully connected to Twitter stream", {ttl: 15000});
                  }
                }
              });

              scope.$watch('state.socket', function(newVal, oldVal) {
                console.log('state.socket', newVal, oldVal);
                if(newVal !== oldVal){
                  if(newVal === 'disconnected'){
                    growl.error("Socket disconnected<br>Application trying to reconnect ...");
                  }
                  if(newVal === 'connected'){
                    growl.success("Socket connected<br>Application successfully connected.");
                  }
                  if(newVal === 'disconnected-due-to-inactivity'){
                    growl.error("Socket disconnected due to inactivity<br>Please refresh your page.");
                  }
                }
              });

              scope.$watch('state.socketTimeout', function(newVal, oldVal) {
                console.log('state.socket', newVal, oldVal);
                if(newVal !== 0){
                  growl.warning("You've been inactive for some time. You will be disconnected in about "+(scope.socketMaxAgeInfos.socketMaxAgeAlertBefore/1000)+" seconds if you don't relaunch.",{
                    title : function(){
                      persistance.extendConnexion();
                      return true;
                    }
                  });
                }
              });

            }
          };
        });