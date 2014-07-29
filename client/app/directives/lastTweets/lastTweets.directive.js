'use strict';

angular.module('tophemanDatavizApp')
  .directive('lastTweets', function () {
    
    var createKeywordsRegExp = function(keywords){
      var stringRegexp = "(";
      keywords.forEach(function(keyword,i){
        stringRegexp += (i > 0 ? '|' : '')+keyword;
      });
      stringRegexp += ")";
      return new RegExp(stringRegexp,'gi');
    };
    
    var createReformatTweetFunction = function(keywords){
      var regexp = createKeywordsRegExp(keywords);
      return function (tweet){
        return tweet.replace(regexp,'<strong>$1</strong>');
      };
    };
    
    return {
      templateUrl: 'app/directives/lastTweets/lastTweets.html',
      restrict: 'EA',
      scope : {
        tweets : '=',
        keywords : '='
      },
      link: function(scope, element, attrs){
        var keywords = scope.keywords;
        var reformatTweet = createReformatTweetFunction(keywords);
        scope.$watch('tweets',function(newCollection){
          newCollection.forEach(function(tweet){
            tweet.text = reformatTweet(tweet.text);
          });
        });
      }
    };
  });