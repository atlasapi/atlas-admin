'use strict';
var PageObject = require('../pageObject');

var epgPageObject = new PageObject();

epgPageObject.get = function () {
  browser.get('#/epg/bt-tv');
};

module.exports = epgPageObject;
