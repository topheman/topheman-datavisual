'use strict';

describe('Directive: lastTweets', function () {

  // load the directive's module and view
  beforeEach(module('tophemanDatavizApp'));
  beforeEach(module('app/directives/lastTweets/lastTweets.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<last-tweets></last-tweets>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the lastTweets directive');
  }));
});