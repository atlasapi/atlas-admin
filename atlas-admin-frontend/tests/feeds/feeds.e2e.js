'use strict';

var feedsPageObject = require('./feeds.pageobject.js');

describe('E2E feeds: Load', function () {
  beforeEach(function(){
    feedsPageObject.get();
  });
  it('should load the feeds view', function () {
    expect(feedsPageObject.getCurrentLocation()).toBe('/feeds/youview');
    expect(feedsPageObject.getH1()).toBe('Feeds Console');
  });
});

describe('E2E feeds: Actions', function () {
  feedsPageObject.get();

  it('should load the publish popup', function () {
    element(by.css('.btn-publish')).click();
    expect(element(by.css('.modal .modal-dialog')).isPresent()).toBeTruthy();
  });

  it('should enter PID and show publish button', function () {
    element(by.css('.pid-check .check-pid-field')).sendKeys('m3t4bc5t');
    element(by.css('.pid-check .check-pid')).click();
    expect(element(by.css('.actionBtn.upload')).isPresent()).toBeTruthy();
  });
});

describe('E2E feeds: Filters', function () {
  beforeEach(function(){
    feedsPageObject.get();
  });

  it('should show 10 results per page', function () {
    element.all(by.repeater('task in tasks')).count().then(function(count) {
      expect(count).toEqual(15);
    });

    element(by.model('page.limit')).$('[value="10"]').click();
    element.all(by.repeater('task in tasks')).count().then(function(count) {
      expect(count).toEqual(10);
    });
  });

  it('should filter results when a URI is input', function () {
    feedsPageObject.filterBy('uri').sendKeys('b00jkt5j');
    feedsPageObject.getFilteredResultsText('task in tasks', 'content_uri').then(function(arr){
      for (var i = 0; i < arr.length; i++) {
        expect(arr[i]).toContain('b00jkt5j');
      };
    });

    element(by.css('.tbl-filters .search-cell.uri')).clear();
  });

  it('should filter results when an ID is input', function () {
    feedsPageObject.filterBy('remoteId').sendKeys('993c4ff5-2856-4f98-898c-7fde1c953224');
    feedsPageObject.getFilteredResultsText('task in tasks', 'remote_id').then(function(arr){
      for (var i = 0; i < arr.length; i++) {
        expect(arr[i]).toContain('993c4ff5-2856-4f98-898c-7fde1c953224');
      };
    });

    element(by.css('.tbl-filters .search-cell.remoteId')).clear();
  });
});

describe('E2E feeds: Single Feed', function () {
  beforeEach(function(){
    feedsPageObject.get();
  });
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
