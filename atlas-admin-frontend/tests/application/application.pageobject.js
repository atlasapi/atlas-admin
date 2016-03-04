'use strict';
var PageObject = require('../pageobject');

var applicationPageObject = new PageObject();

var availableSource = by.repeater('source in app.application.sources.reads | sourceState:\'available\' | sourceEnabled:false');
var enabledSource = by.repeater('source in app.application.sources.reads | sourceState:\'available\' | sourceEnabled:true');

applicationPageObject.get = function () {
  browser.get('#/applications/hpjt');
};

applicationPageObject.getAvailableSource = function() {
  return element(availableSource.row(0));
}

applicationPageObject.getEnabledSource = function () {
  return element.all(enabledSource);
}


module.exports = applicationPageObject;
