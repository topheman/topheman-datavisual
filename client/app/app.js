'use strict';

angular.module('tophemanDatavizApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'btford.socket-io'
])
  .config(function ($routeProvider, $locationProvider) {
    var routeResolver = {
      app: function(persistance) {
        return persistance.isInit();
      }
    };
    $routeProvider
      .when('/', {
        templateUrl: 'app/controllers/main/main.html',
        controller: 'MainCtrl'
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
  });