'use strict';

describe('E2E applications', function () {
  var loginPageObject = require('./login.pageobject.js');

  it('should load the login view', function () {
    loginPageObject.get();
    var currentLocation = loginPageObject.getCurrentLocation();
    expect(currentLocation).toBe('/login');
  });

  it('should redirect to twitter login', function () {
    browser.ignoreSynchronization = true;
    $('.auth-option.twitter').click();
    expect(browser.getCurrentUrl()).toContain('https://api.twitter.com/oauth/authenticate');
  });

  it('should login to twitter account then redirect to the app', function () {
    var auth = require('../../protractor.login.conf.js');
    var protractor = require('protractor');
    var driver = browser.driver;

    var findById = function(name) {
      return driver.findElement(protractor.By.id(name));
    };

    findById('username_or_email').sendKeys(auth.user);
    findById('password').sendKeys(auth.pass);
    findById('allow').click();
  });

  it('should redirect to the app', function () {
    browser.ignoreSynchronization = false;
    browser.wait(protractor.until.elementIsVisible(".application-container"), 5000, 'Error: Element did not display within 5 seconds');
    var currentLocation = loginPageObject.getCurrentLocation();
    expect(currentLocation).toBe('/applications');
  });
});
