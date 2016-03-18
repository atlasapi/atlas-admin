'use strict';
var PageObject = require('../pageObject');

var requestsPageObject = new PageObject();

requestsPageObject.get = function () {
  browser.get('#/manage/requests');
};

module.exports = requestsPageObject;
