'use strict';
var PageObject = require('../pageobject');

var feedsPageObject = new PageObject();

feedsPageObject.get = function () {
  browser.get('#/feeds/youview');
};

module.exports = feedsPageObject;
