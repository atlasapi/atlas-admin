describe('UserMigration.isUserLoggedIn', function () {
  beforeEach(function () {
    spyOn(UserMigration, 'findUserApplications');
  });

  it('should be a function', function () {
    expect((typeof UserMigration.isUserLoggedIn)).toBe('function');
  });

  it('should call `findUserApplications`', function () {
    expect(UserMigration.findUserApplications).toHaveBeenCalled();
  });
});

describe('UserMigration.findUserApplications', function () {
  beforeEach(function () {
    spyOn(UserMigration, 'createGroupForApplication');
    spyOn(UserMigration, 'deactivateUser');
  });

  it('should be a function', function () {
    expect((typeof UserMigration.findUserApplications)).toBe('function');
  });

  it('should call `createGroupForApplication`', function () {
    expect(UserMigration.createGroupForApplication).toHaveBeenCalled();
  });
});

describe('UserMigration.createGroupForApplication', function () {
  it('should be a function', function () {
    expect((typeof UserMigration.createGroupForApplication)).toBe('function');
  });
});

describe('UserMigration.deactivateUser', function () {
  it('should be a function', function () {
    expect((typeof UserMigration.deactivateUser)).toBe('function');
  });
});
