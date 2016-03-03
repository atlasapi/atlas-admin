'use strict';
var PageObject = require('../pageobject');

var applicationPageObject = function () {
  var that = new PageObject();
  that.get = function () {
    browser.get('#/applications');
  };
  return that;
};

module.exports = new applicationPageObject();
