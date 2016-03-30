'use strict';

angular
  .module('atlasAdmin.menu')
  .controller('UserMenuController', UserMenuController);

UserMenuController.$inject = ['$scope', 'Users', '$rootScope', 'Authentication', '$location', 'GroupsService', '$q', 'Atlas'];

function UserMenuController($scope, Users, $rootScope, Authentication, $location, Groups, $q, Atlas) {
  var privateItems;

  $scope.app = {};
  $scope.app.dropdown = true;
  $scope.app.adminMenu = true;
  $scope.app.contentMenu = true;
  $scope.app.appsMenu = true;

  $scope.app.showDropdown = function() {
    $scope.app.dropdown = true;
  };

  $scope.app.showAdminMenu = function() {
    $scope.app.adminMenu = true;
  };

  $scope.app.showContentMenu = function() {
    $scope.app.contentMenu = true;
  };

  $scope.app.showAppsMenu = function() {
    $scope.app.appsMenu = true;
  };

  $scope.app.hideDropdown = function() {
    $scope.app.dropdown = false;
  };

  $scope.app.hideAdminMenu = function() {
    $scope.app.adminMenu = false;
  };

  $scope.app.hideContentMenu = function() {
    $scope.app.contentMenu = false;
  };

  $scope.app.hideAppsMenu = function() {
    $scope.app.appsMenu = false;
  };

  var getPrivateMenuItems = function() {
    var defer = $q.defer();

    if (privateItems) {
      defer.resolve(privateItems)
      return defer.promise;
    }

    Groups
      .get()
      .then(function(result) {
        privateItems = result;
        defer.resolve(privateItems);
    });

    return defer.promise;
  };

  var buildMenu = function(user, groups) {
    // if profile not complete the do not show menu
    var allMenu = [
      // admin only
      { path:'/manage/sources', label:'Sources', role:'admin' },
      { path:'/manage/requests', label:'Requests', role:'admin' },
      { path:'/manage/users', label:'Users', role:'admin' },
      { path:'/manage/usage', label:'API Usage', role:'admin' },
      { path:'/manage/wishlist', label:'Wishlist', role:'admin' }
    ];

    if (_.isArray(groups)) {
      groups.forEach(function(item) {
        if (item.name === 'BTBlackout') {
          allMenu.push({
            path: '/epg/bt-tv',
            label: 'EPG'
          });
        }

        if (item.name === 'BBC-YV-Feed') {
          allMenu.push({
            path: '/feeds',
            label: 'Feeds'
          });
        }

        if (item.name === 'BBC-Scrubbables') {
          allMenu.push({
            path: '/scrubbables',
            label: 'Scrubbables'
          });
        }
      });
    }

    // build the menu
    var menu = [];
    var admin_menu = [];

    allMenu.forEach(function(item) {
      admin_menu.push(item);
      menu.push(item);
    });

    return {
      users: menu,
      admins: admin_menu
    };
  };

  Atlas
    .getRequest('http://admin-backend.metabroadcast.com/1/user')
    .then(getUserData)
    .catch(throwError);

  function getUserData(response) {
    var roles = response.data.role;

    roles.forEach(function(role) {
      if (role.id === 'admins') {
        $scope.isAdmin = true;
      }
    });

    if ($scope.isAdmin) {
      $scope.app.menu = buildMenu();
    }
  }

  function throwError(error) {
    console.error(error);
  }
}
