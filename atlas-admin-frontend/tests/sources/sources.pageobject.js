'use strict';
var PageObject = require('../pageobject');

var sourcesPageObject = new PageObject();

sourcesPageObject.get = function () {
  browser.get('#/manage/sources');
};

module.exports = sourcesPageObject;
