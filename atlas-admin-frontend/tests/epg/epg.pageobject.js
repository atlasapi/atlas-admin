'use strict';
var PageObject = require('../pageobject');

var epgPageObject = new PageObject();

epgPageObject.get = function () {
  browser.get('#/applications');
};

module.exports = epgPageObject;
