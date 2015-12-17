describe('userMigration.isUserLoggedIn', function (done) {
  it('should be a function', function () {
    expect((typeof userMigration.isUserLoggedIn)).toBe('function');
  });

  it('should call `succssCallback`', function (done) {
    var options = {
      url: 'data/user.json',
      headers: {
        iPlanetDirectoryPro: 'abc'
      }
    };

    var d = $.Deferred();
    d.resolve([]);

    spyOn($, 'ajax').and.returnValue(d.promse());

    console.log(UserMigration.isUserLoggedIn);
  });
});

describe('userMigration.findUserApplications', function () {
});

describe('userMigration.createGroupForApplication', function () {
});

describe('userMigration.deactivateUser', function () {
});
