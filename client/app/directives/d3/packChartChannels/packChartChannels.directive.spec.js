'use strict';

describe('Directive: packChartChannels', function () {

  // load the directive's module
  beforeEach(module('tophemanDatavizApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<pack-chart-channels></pack-chart-channels>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the packChartChannels directive');
  }));
});