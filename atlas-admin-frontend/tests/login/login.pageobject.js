'use strict';
var PageObject = require('../pageobject');

var loginPageObject = new PageObject();

loginPageObject.get = function () {
  browser.get('#/login');
};

module.exports = loginPageObject;
