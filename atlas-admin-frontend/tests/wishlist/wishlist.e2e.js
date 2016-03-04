'use strict';

var wishlistPageObject = require('./wishlist.pageobject.js');

describe('E2E wishlist: Load', function () {
  beforeEach(function () {
    wishlistPageObject.get();
  });
  it('should load the wishlist view', function () {
    expect(wishlistPageObject.getCurrentLocation()).toBe('/wishlist');
    expect(wishlistPageObject.getH1()).toBe('Request new sources and features');
  });
});

describe('E2E wishlist: Tabs', function () {
  beforeEach(function () {
    wishlistPageObject.get();
  });
  it('should switch tab', function () {
    expect(wishlistPageObject.panelTitle()).toBe('Sources you\'ve asked for');
    element(by.css('.app-tab.features')).click();
    expect(wishlistPageObject.panelTitle()).toEqual('Features in the pipeline');
  });
});
