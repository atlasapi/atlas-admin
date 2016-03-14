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
    return element(by.css('.app-header .page-title')).getText();
  }
};

module.exports = PageObject;
