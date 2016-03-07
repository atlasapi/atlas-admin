'use strict';
var PageObject = require('../pageobject');

var wishlistManagerPageObject = new PageObject();

wishlistManagerPageObject.get = function () {
  browser.get('#/manage/wishlist');
};

wishlistManagerPageObject.panelTitle = function () {
  return element(by.css('.panel-full .panel-header h2')).getText();
}

module.exports = wishlistManagerPageObject;
