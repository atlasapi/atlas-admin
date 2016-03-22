'use strict';
var PageObject = require('../pageObject');

var loginPageObject = new PageObject();

loginPageObject.get = function () {
  browser.get('#/login');
};

module.exports = loginPageObject;
