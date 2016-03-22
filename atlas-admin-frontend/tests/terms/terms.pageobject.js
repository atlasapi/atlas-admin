'use strict';
var PageObject = require('../pageObject');

var termsPageObject = new PageObject();

termsPageObject.get = function () {
  browser.get('#/terms');
};

module.exports = termsPageObject;
