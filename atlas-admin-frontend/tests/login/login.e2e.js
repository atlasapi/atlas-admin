'use strict';

describe('E2E login', function () {
  var loginPageObject = require('./login.pageobject.js');

  it('should load the login view', function () {
    loginPageObject.get();
    expect(loginPageObject.getCurrentLocation()).toBe('/login');
  });

  it('should redirect to twitter login', function () {
    $('.auth-option.twitter').click().then(function () {
      expect(browser.getCurrentUrl()).toContain('https://api.twitter.com/oauth/authenticate');
    });
  });

  it('should login to twitter account then redirect to the app', function () {
    var auth = require('./login.conf.js');
    var protractor = require('protractor');
    var driver = browser.driver;
    protractor.ignoreSynchronization = true;

    var findById = function(name) {
      return driver.findElement(protractor.By.id(name));
    };

    findById('username_or_email').sendKeys(auth.user);
    findById('password').sendKeys(auth.pass);
    findById('allow').click();

    driver.sleep(2000);
  });
});
