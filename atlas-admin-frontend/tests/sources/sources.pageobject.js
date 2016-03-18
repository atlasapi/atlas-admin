'use strict';
var PageObject = require('../pageObject');

var sourcesPageObject = new PageObject();

sourcesPageObject.get = function () {
  browser.get('#/manage/sources');
};

module.exports = sourcesPageObject;
