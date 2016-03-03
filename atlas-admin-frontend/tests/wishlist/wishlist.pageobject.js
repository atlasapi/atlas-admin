'use strict';
var PageObject = require('../pageobject');

var wishlistPageObject = new PageObject();

wishlistPageObject.get = function () {
  browser.get('#/wishlist');
};

module.exports = wishlistPageObject;
