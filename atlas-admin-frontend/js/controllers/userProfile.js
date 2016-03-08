'use strict';
var app = angular.module('atlasAdmin.controllers.user', []);
app.controller('UserMenuController', ['$scope', 'Users', '$rootScope', 'Authentication', '$location', 'GroupsService', '$q',
    function($scope, Users, $rootScope, Authentication, $location, Groups, $q) {
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
            $scope.app.user = user;
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
