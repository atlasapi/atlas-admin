'use strict';

var feedsPageObject = require('./feeds.pageobject.js');

describe('E2E feeds: Load', function () {
  it('should load the epg view', function () {
  feedsPageObject.get();
    expect(feedsPageObject.getCurrentLocation()).toBe('/feeds/youview');
    expect(feedsPageObject.getH1()).toBe('Feeds Console');
  });
});

describe('E2E feeds: Actions', function () {
  it('should load the publish popup', function () {
    element(by.css('.btn-publish')).click();
    expect(element(by.css('.modal .modal-dialog')).isPresent()).toBeTruthy();
  });

  it('should enter PID and show publish button', function () {
    element(by.css('.pid-check .check-pid-field')).sendKeys('m3t4bc5t');
    element(by.css('.pid-check .check-pid')).click();
    expect(element(by.css('.actionBtn.upload')).isPresent()).toBeTruthy();
  });

  it('should close the modal on bg click', function () {
    element(by.css('.feedsAcceptModal')).click().then(function() {
      expect(element(by.css('.modal.modal-dialog')).isPresent()).toBeFalsy();
    });
  });
});
