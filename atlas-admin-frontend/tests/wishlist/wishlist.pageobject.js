'use strict';
var PageObject = require('../pageobject');

var wishlistPageObject = new PageObject();

wishlistPageObject.get = function () {
  browser.get('#/wishlist');
};

wishlistPageObject.panelTitle = function () {
  return element(by.css('.panel-full .panel-header h2.panel-title')).getText();
}

module.exports = wishlistPageObject;
