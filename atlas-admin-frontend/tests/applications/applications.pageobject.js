'use strict';
var PageObject = require('../pageObject');

var applicationsPageObject = new PageObject();

applicationsPageObject.get = function () {
  browser.get('#/applications');
};

module.exports = applicationsPageObject;
