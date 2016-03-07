'use strict';

var applicationPageObject = require('./application.pageobject.js');

describe('E2E applications: Load', function () {

  it('should load the applications view', function () {
    applicationPageObject.get();
    expect(applicationPageObject.getCurrentLocation()).toBe('/applications/hpjt');
    expect(applicationPageObject.getH1()).toBe('Edit application');
  });
});

describe('E2E applications: Sources', function () {
  it('should enable youtube source', function () {
    expect(applicationPageObject.getAvailableSource().element(by.css('.source-title')).getText()).toEqual('YouTube');
    applicationPageObject.getAvailableSource().element(by.css('button.button-link')).click();
    expect(applicationPageObject.getEnabledSource().last().element(by.css('.source-title')).getText()).toEqual('YouTube');
  });

  it('should disable youtube source', function () {
    applicationPageObject.getEnabledSource().last().element(by.css('button.button-link.disable')).click();
    expect(applicationPageObject.getEnabledSource().last().element(by.css('.source-title')).getText()).toEqual('BBC');
  });

  // it('should drag youtube source to the top', function () {
  //   browser.actions().dragAndDrop(
  //     applicationPageObject.getEnabledSource().last().element(by.css('.list-group-item')),
  //     applicationPageObject.getEnabledSource().first().element(by.css('.list-group-item'))
  //   ).mouseUp().perform();
  //
  //   expect(applicationPageObject.getEnabledSource().first().element(by.css('.source-title')).getText()).toEqual('YouTube');
  //   expect(applicationPageObject.getEnabledSource().last().element(by.css('.source-title')).getText()).toEqual('BBC');
  //   //browser.pause();
  // });
});