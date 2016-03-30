'use strict';

angular
  .module('atlasAdmin.menu')
  .controller('UserMenuController', UserMenuController);

UserMenuController.$inject = ['$scope', 'Users', '$rootScope', 'Authentication', '$location', 'GroupsService', '$q', 'Atlas', '$log'];

function UserMenuController($scope, Users, $rootScope, Authentication, $location, Groups, $q, Atlas, $log) {
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

  var buildMenu = function(roles) {
    var allMenu = [
      { path: '/manage/sources', label: 'Sources', role: 'admin' },
      { path: '/manage/requests', label: 'Requests', role: 'admin' },
      { path: '/manage/users', label: 'Users', role: 'admin' },
      { path: '/manage/usage', label: 'API Usage', role: 'admin' },
      { path: '/manage/wishlist', label: 'Wishlist', role: 'admin' },
      { path: '/epg/bt-tv', label: 'EPG', role: 'bt-blackout' },
      { path: '/feeds', label: 'Feeds', role: 'youview-feeds' },
      { path: '/scrubbables', label: 'Scrubbables', role: 'scrubbables' }
    ];

    var menu = [];
    var adminMenu = [];

    allMenu.forEach(function(item) {
      if ($scope.isAdmin) {
        if (item.role === 'admin') {
          adminMenu.push(item);
        } else {
          menu.push(item);
        }
      } else {
        roles.forEach(function(role) {
          if (item.role === role.id) {
            menu.push(item);
          }
        });
      }
    });

    return {
      users: menu,
      admins: adminMenu
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

    $scope.app.menu = buildMenu(roles);
  }

  function throwError(error) {
    console.error(error);
  }
}
