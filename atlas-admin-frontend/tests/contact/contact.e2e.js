'use strict';

var contactPageObject = require('./contact.pageobject.js');

describe('E2E contact: Load', function () {
  beforeEach(function () {
    contactPageObject.get();
  });

  it('should load the contact view', function () {
    expect(contactPageObject.getCurrentLocation()).toBe('/contact');
    expect(contactPageObject.getH1()).toBe('Contact Us');
  });
});
