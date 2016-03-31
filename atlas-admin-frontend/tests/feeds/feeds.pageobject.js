'use strict';
var PageObject = require('../pageObject');

var feedsPageObject = new PageObject();

feedsPageObject.get = function () {
  browser.get('#/feeds/youview');
};

feedsPageObject.getFeed = function () {
  browser.get('#/feeds/youview/dxh4jj');
};

feedsPageObject.filterBy = function (filter) {
  return element(by.css('.tbl-filters .search-cell.' + filter))
};

feedsPageObject.getFilteredResultsText = function (repeater, column) {
  return element.all(
    by.repeater(repeater)
      .column(column)
  )
  .map(function (elm) {
    return elm.getText();
  });
};

module.exports = feedsPageObject;
