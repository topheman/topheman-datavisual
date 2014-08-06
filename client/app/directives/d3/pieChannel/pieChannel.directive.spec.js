'use strict';

describe('Directive: pieChannel', function () {

  // load the directive's module and view
  beforeEach(module('tophemanDatavizApp'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<pie-channel></pie-channel>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the pieChannel directive');
  }));
});