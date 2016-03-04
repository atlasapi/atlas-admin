'use strict';

var applicationsPageObject = require('./epg.pageobject.js');
applicationsPageObject.get();

describe('E2E epg: Load', function () {
  it('should load the epg view', function () {
    expect(applicationsPageObject.getCurrentLocation()).toBe('/epg/bt-tv');
    expect(applicationsPageObject.getH1()).toBe('Bt Blackout');
  });
});
