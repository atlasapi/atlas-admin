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

describe('E2E feeds: Filters', function () {
  it('should show 10 results per page', function () {
    element.all(by.repeater('task in tasks | orderBy:table.order:table.reverse')).count().then(function(count) {
      expect(count).toEqual(15);
    });
    element(by.model('page.limit')).$('[value="10"]').click();
    element.all(by.repeater('task in tasks | orderBy:table.order:table.reverse')).count().then(function(count) {
      expect(count).toEqual(10);
    });
  });

  it('should filter results when a URI is input', function () {
    feedsPageObject.get();
    element(by.css('.filter-bar .search-cell.uri')).sendKeys('b073bfv8');
    element.all(by.repeater('task in tasks | orderBy:table.order:table.reverse')).count().then(function(count) {
      expect(count).toEqual(4);
    });
    element(by.css('.filter-bar .search-cell.uri')).clear();
  });

  it('should filter results when an ID is input', function () {
    element(by.css('.filter-bar .search-cell.remoteId')).sendKeys('ade2cde5-c2a5-4883-9aca-c301e562dfe5');
    element.all(by.repeater('task in tasks | orderBy:table.order:table.reverse')).count().then(function(count) {
      expect(count).toEqual(1);
    });
    element(by.css('.filter-bar .search-cell.remoteId')).clear();
  });
});

describe('E2E feeds: Single Feed', function () {
  it('should load single feed', function () {
    feedsPageObject.getFeed();
    expect(feedsPageObject.getCurrentLocation()).toBe('/feeds/youview/dxh4jj');
    expect(feedsPageObject.getH1()).toContain('Breakdown for transaction');
  });

  it('should load data', function () {
    feedsPageObject.getFeed();
    element(by.css('span.button.loadData')).click();
    expect($('[ng-show=showData].xml-data').isDisplayed()).toBeTruthy();
  });
});
