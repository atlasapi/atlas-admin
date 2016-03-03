'use strict';

function PageObject() {
}
PageObject.prototype = {
  /*
   Gets the current location of the browser, ignoring the /# prefix
   */
  getCurrentLocation: function () {
    var urlPrefix = '/#';
    return browser.getLocationAbsUrl().then(function (url) {
      var ret = url.replace(browser.baseUrl, '').replace(urlPrefix, '');

      return ret;
    });
  },
  /*
   Gets the text of the current page's h1 tag
   */
  getH1: function () {
    return element(by.tagName('h1')).getText();
  },

  scrollDownPage: function (callBack) {
    browser.executeScript(' window.scrollTo(0,200) ').then(
      callBack(element(by.css('.page-header')).getAttribute('class'))
    );
  },

  scrollUpPage: function (callBack) {
    browser.executeScript('window.scrollTo(0,200); window.scrollTo(0,0)').then(
      callBack(element(by.css('.page-header')).getAttribute('class'))
    );
  }

};

module.exports = PageObject;
