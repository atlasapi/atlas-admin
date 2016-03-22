'use strict';
var PageObject = require('../pageObject');

var feedsPageObject = new PageObject();

feedsPageObject.get = function () {
  browser.get('#/feeds/youview');
};

feedsPageObject.getFeed = function () {
  browser.get('#/feeds/youview/dxh4jj');
};

module.exports = feedsPageObject;
