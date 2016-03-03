'use strict';

describe('E2E applications', function () {
  var applicationPageObject = require('./applications.pageobject.js');

  beforeEach(function () {
    applicationPageObject.get();
  });

  it('should load the applications view', function () {
    var currentLocation = applicationPageObject.getCurrentLocation();
    expect(currentLocation).toBe('#/applications');
  });

});
