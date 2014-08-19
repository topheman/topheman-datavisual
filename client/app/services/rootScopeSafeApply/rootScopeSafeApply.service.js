angular.module('tophemanDatavizApp')
        .service('rootScopeSafeApply', ['$rootScope', function($rootScope) {
            'use strict';

            /**
             * Safe $rootScope.$apply which check for $apply or $digest phase before
             * 
             * @param {Function} fn
             * @returns {undefined}
             */
            var rootScopeSafeApply = function(fn) {
              var phase = $rootScope.$$phase;
              if (phase === '$apply' || phase === '$digest') {
                if (fn && (typeof (fn) === 'function')) {
                  fn();
                }
              } else {
                $rootScope.$apply(fn);
              }
            };

            return rootScopeSafeApply;

          }]);