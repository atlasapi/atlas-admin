'use strict';
var PageObject = require('../pageobject');

var loginPageObject = function () {
  var that = new PageObject();
  that.get = function () {
    browser.get('#/login');
  };
  return that;
};

module.exports = new loginPageObject();
