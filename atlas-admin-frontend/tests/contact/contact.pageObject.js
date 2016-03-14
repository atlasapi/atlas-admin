'use strict';
var PageObject = require('../pageobject');

var contactPageObject = new PageObject();

contactPageObject.get = function () {
  browser.get('#/contact');
};

module.exports = contactPageObject;
