describe('userMigration.isUserLoggedIn', function () {
  var callback = jasmine.createSpy();
  var options = {
    url: 'data/user.json',
    headers: {
      iPlanetDirectoryPro: Cookies.get('iPlanetDirectoryPro')
    }
  };

  beforeEach(function () {
    spyOn($, 'ajax').and.callFake(function (e) {
      e.success({});
    });
    userMigration.isUserLoggedIn(options, callback);
  });

  it('should be a function', function () {
    expect((typeof userMigration.isUserLoggedIn)).toBe('function');
  });

  it('should call the options url', function () {
    var request = $.ajax.calls.mostRecent().args[0];
    expect(request.url).toEqual(options.url);
  });

  it('should send the options headers', function () {
    var request = $.ajax.calls.mostRecent().args[0];
    expect(request.headers).toEqual(options.headers);
  });

  it('should return a response', function () {
    userMigration.isUserLoggedIn(options, callback);
    expect(callback).toHaveBeenCalled();
  });
});

describe('userMigration.findUserApplications', function () {
  it('should be a function', function () {
    expect((typeof userMigration.findUserApplications)).toBe('function');
  });
});

describe('userMigration.createGroupForApplication', function () {
  it('should be a function', function () {
    expect((typeof userMigration.createGroupForApplication)).toBe('function');
  });
});

describe('userMigration.deactivateUser', function () {
  it('should be a function', function () {
    expect((typeof userMigration.deactivateUser)).toBe('function');
  });
});
