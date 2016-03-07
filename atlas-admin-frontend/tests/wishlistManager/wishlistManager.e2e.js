'use strict';

var wishlistManagerPageObject = require('./wishlistManager.pageobject.js');

describe('E2E wishlist manager: Load', function () {
  beforeEach(function () {
    wishlistManagerPageObject.get();
  });

  it('should load the wishlist view', function () {
    expect(wishlistManagerPageObject.getCurrentLocation()).toBe('/manage/wishlist');
    expect(wishlistManagerPageObject.getH1()).toBe('Wishlist manager');
  });
});

describe('E2E wishlist manager: Tabs', function () {
  it('should switch tab', function () {
    expect(wishlistManagerPageObject.panelTitle()).toBe('Source requests');
    element(by.css('.app-tab.feature-requests')).click();
    expect(wishlistManagerPageObject.panelTitle()).toBe('Feature requests');
  });
});

describe('E2E wishlist manager: modal', function () {
  it('should load the modal', function () {
    element(by.css('.app-tab.sources')).click();
    element(by.css('.panel-full.add')).click();
    expect(element(by.css('.modal .modal-dialog')).isPresent()).toBeTruthy();
  });
  it('should close the modal when cancel is clicked', function () {
    element(by.css('.app-modal-content button.secondary')).click();
    expect(element(by.css('.modal .modal-dialog')).isPresent()).toBeFalsy();
  });
});
