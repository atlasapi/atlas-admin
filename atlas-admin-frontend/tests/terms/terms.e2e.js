'use strict';

var termsPageObject = require('./terms.pageobject.js');

describe('E2E terms: Load', function () {
  beforeEach(function () {
    termsPageObject.get();
  });

  it('should load the terms view', function () {
    expect(termsPageObject.getCurrentLocation()).toBe('/terms');
    expect(termsPageObject.getH1()).toBe('Atlas Terms and Conditions');
  });
});
