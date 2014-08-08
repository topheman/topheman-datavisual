'use strict';

describe('Service: displayState', function () {

  // load the service's module
  beforeEach(module('tophemanDatavizApp'));

  // instantiate service
  var displayState;
  beforeEach(inject(function (_displayState_) {
    displayState = _displayState_;
  }));

  it('should do something', function () {
    expect(!!displayState).toBe(true);
  });

});
