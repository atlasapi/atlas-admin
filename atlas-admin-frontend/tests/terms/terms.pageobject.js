'use strict';
var PageObject = require('../pageobject');

var termsPageObject = new PageObject();

termsPageObject.get = function () {
  browser.get('#/terms');
};

module.exports = termsPageObject;
