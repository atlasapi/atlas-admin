'use strict';

var feedsPageObject = require('./feeds.pageobject.js');

describe('E2E epg: Load', function () {
  it('should load the epg view', function () {
  feedsPageObject.get();
    expect(feedsPageObject.getCurrentLocation()).toBe('/feeds/youview');
    expect(feedsPageObject.getH1()).toBe('Feeds Console');
  });
});
