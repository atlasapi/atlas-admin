'use strict';

var usersPageObject = require('./users.pageobject.js');

describe('E2E users: Load', function () {
  beforeEach(function () {
    usersPageObject.get();
  });

  it('should load the wishlist view', function () {
    expect(usersPageObject.getCurrentLocation()).toBe('/manage/users');
    expect(usersPageObject.getH1()).toBe('Manage users');
  });
});

describe('E2E users: filter', function () {
  it('should filters to singe user', function () {
    element(by.css('.tbl-filters input')).sendKeys('phil giles');
    element.all(by.repeater('user in app.users | filter:query | orderBy:app.predicate:app.reverse | startFrom:(app.currentPage-1)*app.pageSize | limitTo:app.pageSize')).count().then(function(count) {
      expect(count).toEqual(1);
    });
  });

  it('should load individual user view', function () {
    usersPageObject.getUser();
    expect(usersPageObject.getH1()).toBe('Profile for Phil Giles');
  });
});
