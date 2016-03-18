'use strict';
var PageObject = require('../pageObject');

var usersPageObject = new PageObject();

usersPageObject.get = function () {
  browser.get('#/manage/users');
};

usersPageObject.getUser = function () {
  browser.get('#/manage/users/hnx8')
};

module.exports = usersPageObject;
