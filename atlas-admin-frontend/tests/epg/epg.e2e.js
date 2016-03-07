'use strict';

var epgPageObject = require('./epg.pageobject.js');

describe('E2E epg: Load', function () {
  it('should load the epg view', function () {
  epgPageObject.get();
    expect(epgPageObject.getCurrentLocation()).toBe('/epg/bt-tv');
    expect(epgPageObject.getH1()).toBe('BT Blackout');
  });

  it('should load the epg iframe', function () {
    expect(element(by.id('epgWidget')).isDisplayed()).toBeTruthy();
  });
});
