'use strict';

describe('Directive: stateNotifications', function () {

  // load the directive's module and view
  beforeEach(module('tophemanDatavizApp'));
  beforeEach(module('app/directives/stateNotifications/stateNotifications.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<state-notifications></state-notifications>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the stateNotifications directive');
  }));
});