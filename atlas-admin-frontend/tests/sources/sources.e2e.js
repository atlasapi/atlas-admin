'use strict';

var sourcesPageObject = require('./sources.pageobject.js');

describe('E2E wishlist: Load', function () {
  beforeEach(function () {
    sourcesPageObject.get();
  });

  it('should load the wishlist view', function () {
    expect(sourcesPageObject.getCurrentLocation()).toBe('/manage/sources');
    expect(sourcesPageObject.getH1()).toBe('Manage sources');
  });
});

describe('E2E sources: filter', function () {
  it('should filter results', function () {
    element(by.css('.query-filter input')).sendKeys('youtube');
    element.all(by.repeater('source in app.sources | filter:query | orderBy:app.predicate:app.reverse | startFrom:(app.currentPage-1)*app.pageSize  | limitTo:app.pageSize')).count().then(function(count) {
      expect(count).toEqual(2);
    });
  });
});
