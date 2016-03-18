'use strict';
var PageObject = require('../pageObject');

var contactPageObject = new PageObject();

contactPageObject.get = function () {
  browser.get('#/contact');
};

module.exports = contactPageObject;
