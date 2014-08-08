'use strict';

describe('Directive: barChartChannel', function () {

  // load the directive's module
  beforeEach(module('tophemanDatavizApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<bar-chart-channel></bar-chart-channel>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the barChartChannel directive');
  }));
});