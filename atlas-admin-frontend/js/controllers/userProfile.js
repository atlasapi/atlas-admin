'use strict';
var app = angular.module('atlasAdmin.controllers.user', []);
app.controller('UserProfileController', function($scope, $rootScope, $routeParams, Users, Applications, $location, userUrl) {
    $scope.app = {};
    $scope.app.isAdmin = false;
    $scope.app.predicate = 'created';
    $scope.app.reverse = true;
    $scope.app.pageSize = 10;
    $scope.app.currentPage = 1;

    var populateApplications = function(idList) {
        $scope.app.applications = [];
        for (var i = 0; i < idList.length; i++) {
            Applications.get(idList[i]).then(function(application) {
                $scope.app.applications.push(application);
            });
        }
    };


    if ($routeParams.uid) {
        Users.get($routeParams.uid).then(function(user) {
          $scope.app.user = user;
            var title = 'Profile for ';
            if (user.full_name) {
                title += user.full_name;
            } else {
                title += 'user id ' + user.id;
            }
            $rootScope.view_title = title;
            Users.currentUser(function(editingUser) {
                $scope.app.isAdmin = editingUser.role === 'admin';
                $scope.app.editingUser = editingUser.id;

                if ($scope.app.isAdmin) {
                    populateApplications($scope.app.user.applications);
                }
            });
        });
    } else {
        Users.currentUser(function(user) {
          var userCookie = Cookies.get('iPlanetDirectoryPro');
          var options = {
            url: userUrl,
            headers: {
              iPlanetDirectoryPro: userCookie
            }
          };

          userMigration.isUserLoggedIn(options, function (response) {
            if (!response) {
              $scope.app.user = user;
            }

            var newUser = {
              id: response.attributes.uid,
              screen_name: response.attributes.sn,
              email: response.attributes.mail,
              applications: _.map(response.role, function (app) {
                return app.id;
              })
            };

            if (newUser.applications.indexOf('mbst-admin') !== -1) {
              newUser.role = 'admin';
            }

            console.log('newUser', newUser);

            $scope.app.user = newUser;
            $rootScope.view_title = 'Your profile';
          });
        });
    }

    $scope.save = function() {
        if ($scope.userForm.$invalid) {
            return;
        }
        $scope.app.changed = false;
        $scope.app.newUser = $scope.app.user.profile_complete === false;
        $scope.app.user.profile_complete = true;
        Users.update($scope.app.user).then(function() {
            var successMessage = 'Changes saved';
            // redirect new users to apps screen otherwise show message
            if ($scope.app.newUser) {
               $location.path('/');
            } else {
               $scope.successMessage = 'Changes saved';
            }
        },
        function() {
            $scope.errorMessage = 'Sorry, there was an error and your changes could not be saved';
        });
    };
});
app.controller('AllUsersController', function($scope, $rootScope, $routeParams, Users) {
    $rootScope.view_title = 'Manage users';
    $scope.app = {};
    Users.all().then(function(users) {
         $scope.app.users = users;
    });
    $scope.app.predicate = 'full_name';
    $scope.app.reverse = false;
    $scope.app.pageSize = 10;
    $scope.app.currentPage = 1;
});
app.controller('UserMenuController', ['$scope', 'Users', '$rootScope', 'Authentication', '$location', 'GroupsService', '$q', 'userUrl',
    function($scope, Users, $rootScope, Authentication, $location, Groups, $q, userUrl) {
    var privateItems;
    $scope.app = {};
    $scope.app.dropdown = true;
    $scope.app.adminMenu = true;
    $scope.app.contentMenu = true;
    $scope.app.appsMenu = true;

    $scope.app.showDropdown = function () {
        $scope.app.dropdown = true;
    };

    $scope.app.showAdminMenu = function () {
        $scope.app.adminMenu = true;
    };

    $scope.app.showContentMenu = function () {
        $scope.app.contentMenu = true;
    };

    $scope.app.showAppsMenu = function () {
        $scope.app.appsMenu = true;
    };

    $scope.app.hideDropdown = function () {
        $scope.app.dropdown = false;
    };

    $scope.app.hideAdminMenu = function () {
        $scope.app.adminMenu = false;
    };

    $scope.app.hideContentMenu = function () {
        $scope.app.contentMenu = false;
    };

    $scope.app.hideAppsMenu = function () {
        $scope.app.appsMenu = false;
    };

    var getPrivateMenuItems = function() {
        var defer = $q.defer();
        if (privateItems) {
            defer.resolve(privateItems)
            return defer.promise;
        }
        Groups.get().then(function(result) {
             privateItems = result;
             defer.resolve(privateItems);
        })
        return defer.promise;
    }

    var buildMenu = function(user, groups) {
        // if profile not complete the do not show menu
        var allMenu = [
            // admin only
            {path:'/manage/sources', label:'Sources', role:'admin'},
            {path:'/manage/requests', label:'Requests', role:'admin'},
            {path:'/manage/users', label:'Users', role:'admin'},
            {path:'/manage/usage', label:'API Usage', role:'admin'},
            {path:'/manage/wishlist', label:'Wishlist', role:'admin'}];

        if (_.isArray(groups)) {
            groups.forEach(function(item) {
                if (item.name === 'BTBlackout') { allMenu.push({path: '/epg/bt-tv', label: 'EPG'}); }
                if (item.name === 'BBC-YV-Feed') { allMenu.push({path: '/feeds', label: 'Feeds'}); }
                if (item.name === 'BBC-Scrubbables') { allMenu.push({path: '/scrubbables', label: 'Scrubbables'}); }
            })
        }

        // build the menu
        var menu = [];
        var admin_menu = [];
        for (var i = 0; i < allMenu.length; i++) {
            var item = allMenu[i];
            if (!item.hasOwnProperty('role') || item.role === 'regular') {
                menu.push(item);
            }else if (user.role === 'admin') {
                admin_menu.push(item);
            }
        }
        return {
            users: menu,
            admins: admin_menu
        }
    };

    if (Authentication.getToken()) {
      Users.currentUser(function(user) {
        var userCookie = Cookies.get('iPlanetDirectoryPro');
        var options = {
          url: userUrl,
          headers: {
            iPlanetDirectoryPro: userCookie
          }
        };

        userMigration.isUserLoggedIn(options, function (response) {
          if (!response) {
            $scope.app.user = user;
          }

          var newUser = {
            id: response.attributes.uid,
            screen_name: response.attributes.sn,
            email: response.attributes.mail,
            applications: _.map(response.role, function (app) {
              return app.id;
            })
          };

          if (newUser.applications.indexOf('mbst-admin') !== -1) {
            newUser.role = 'admin';
          }

          $scope.app.user = newUser;
        });

        // find any custom menu items for this user
        getPrivateMenuItems().then(function(groups) {
          $scope.app.userGroups = groups;
          $scope.app.menu = buildMenu(user, groups);
        },
        function() {
          $scope.app.menu = buildMenu(user);
        });
      });
    }
}]);

app.controller('UserLicenseController', function($scope, $rootScope, $routeParams, Users, $location, $window, $sce, $log, ProfileStatus) {
    // only try to get user if logged in
    $scope.view_title = 'Atlas Terms and Conditions'
    $scope.app = {};
    Users.currentUser(function(user) {
        $scope.app.user = user;
    });

    var error = function(error) {
        $log.error(error);
        $window.location.href = '/#/error?type=not_available';
    };

    Users.getTermsAndConditions().then(function(license) {
      $scope.app.license = $sce.trustAsHtml(license);
    }, error);

    $scope.app.accept = function() {
        Users.acceptTermsAndConditions($scope.app.user.id).then(function(data) {
            ProfileStatus.setLicenseAccepted(true);
            $location.path('/profile');
        }, error);
    }

    $scope.app.reject = function() {
        $location.path('/logout');
    };
});
