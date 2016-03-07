'use strict';
var PageObject = require('../pageobject');

var requestsPageObject = new PageObject();

requestsPageObject.get = function () {
  browser.get('#/manage/requests');
};

module.exports = requestsPageObject;
