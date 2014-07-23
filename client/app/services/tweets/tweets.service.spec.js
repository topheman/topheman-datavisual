'use strict';

describe('Service: tweets', function () {

  // load the service's module
  beforeEach(module('tophemanDatavizApp'));

  // instantiate service
  var tweets;
  beforeEach(inject(function (_tweets_) {
    tweets = _tweets_;
  }));

  it('should do something', function () {
    expect(!!tweets).toBe(true);
  });

});
