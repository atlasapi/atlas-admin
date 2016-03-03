'use strict';
var PageObject = require('../pageobject');

var applicationPageObject = new PageObject();

applicationPageObject.get = function () {
  browser.get('#/applications');
};

module.exports = applicationPageObject;
