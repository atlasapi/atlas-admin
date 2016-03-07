'use strict';
var PageObject = require('../pageobject');

var applicationsPageObject = new PageObject();

applicationsPageObject.get = function () {
  browser.get('#/applications');
};

module.exports = applicationsPageObject;
