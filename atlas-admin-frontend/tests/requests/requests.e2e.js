'use strict';

var requestsPageObject = require('./requests.pageobject.js');

describe('E2E requests: Load', function () {
  beforeEach(function () {
    requestsPageObject.get();
  });

  it('should load the wishlist view', function () {
    expect(requestsPageObject.getCurrentLocation()).toBe('/manage/requests');
    expect(requestsPageObject.getH1()).toBe('Manage source requests');
  });
});
