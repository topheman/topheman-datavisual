'use strict';

describe('Service: persistance', function () {

  // load the service's module
  beforeEach(module('tophemanDatavizApp'));

  // instantiate service
  var tweets;
  beforeEach(inject(function (_persistance_) {
    persistance = _persistance_;
  }));

  it('should do something', function () {
    expect(!!persistance).toBe(true);
  });

});
