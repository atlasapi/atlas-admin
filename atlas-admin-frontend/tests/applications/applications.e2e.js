'use strict';

var applicationPageObject = require('./applications.pageobject.js');
applicationPageObject.get();

describe('E2E applications: Load', function () {
  it('should load the applications view', function () {
    expect(applicationPageObject.getCurrentLocation()).toBe('/applications');
    expect(applicationPageObject.getH1()).toBe('My Applications');
  });
});

describe('E2E applications: modal', function () {
  it('should open create application modal when button is clicked', function () {
    element(by.css('.button.create-application')).click();
    expect(element(by.css('.modal .modal-dialog')).isPresent()).toBeTruthy();
  });

  it('should close the modal when cancel is clicked', function () {
    element(by.css('.app-modal-body .btn.cancel')).click();
    expect(element(by.css('.modal .modal-dialog')).isPresent()).toBeFalsy();
  });
});

describe('E2E applications: pagination', function () {
  it('should return no results when a unused value is input', function () {
    element(by.id('queryFilter')).sendKeys('qwertyuioplkjhgfdsazxcvbnm');

    browser.driver.findElements(by.css('.applications-list .tbl tbody tr')).
      then(function(elems) {
        expect(elems.length).toEqual(0);
      }
    );
  });

  it('should return no results when a unused value is input', function () {
    element(by.id('queryFilter')).clear();
    element(by.id('queryFilter')).sendKeys('mbst');

    browser.driver.findElements(by.css('.applications-list .tbl tbody tr')).
      then(function(elems) {
        expect(elems.length).toBeGreaterThan(0);
      }
    );
  });
});
