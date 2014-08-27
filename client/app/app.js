'use strict';

angular.module('tophemanDatavizApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'btford.socket-io',
  'ngAnimate',
  'angular-growl'
])
  .config(function ($routeProvider, $locationProvider, growlProvider) {
    var routeResolver = {
      app: ['persistance',function(persistance) {
        return persistance.isInit();
      }]
    };
    $routeProvider
      .when('/', {
        templateUrl: 'app/controllers/main/main.html',
        controller: 'MainCtrl',
        resolve: routeResolver
      })
      .when('/channel/:channel', {
        templateUrl: 'app/controllers/channel/channel.html',
        controller: 'ChannelCtrl',
        resolve: routeResolver
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
    
    growlProvider.onlyUniqueMessages(false);
    growlProvider.globalPosition('bottom-right');
    growlProvider.globalReversedOrder(true);
    growlProvider.globalDisableCountDown(true);
    growlProvider.globalTimeToLive(8000);
  });