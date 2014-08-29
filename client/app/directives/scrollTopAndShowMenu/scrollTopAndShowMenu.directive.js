'use strict';

angular.module('tophemanDatavizApp')
        .directive('scrollTopAndShowMenu', function($document, $timeout) {
          return {
            restrict: 'A',
            link: function(scope, element, attrs) {
              element.bind('click', function() {
                $document.scrollTop(0, 1000).then(function() {
                  if (!$('.nav.navbar-nav').is(':visible')) {
                    $timeout(function() {
                      $('.navbar-header button').click();
                    }, 200);
                  }
                });
              });
            }
          };
        });