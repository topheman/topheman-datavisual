'use strict';

describe('Directive: connexionTime', function () {

  // load the directive's module and view
  beforeEach(module('tophemanDatavizApp'));
  beforeEach(module('app/directives/connexionTime/connexionTime.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<connexion-time></connexion-time>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the stateNotifications directive');
  }));
});