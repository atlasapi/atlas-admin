describe('UserMigration.isUserLoggedIn', function () {
  beforeEach(function () {
    var successCallback = function () {
      return true;
    };
    spyOn(successCallback);
    UserMigration.isUserLoggedIn(successCallback);
  });

  it('should be a function', function () {
    expect((typeof UserMigration.isUserLoggedIn)).toBe('function');
  });

  it('should call `succssCallback`', function () {
    expect(successCallback).toHaveBeenCalled();
  });
});

describe('UserMigration.findUserApplications', function () {
});

describe('UserMigration.createGroupForApplication', function () {
});

describe('UserMigration.deactivateUser', function () {
});
