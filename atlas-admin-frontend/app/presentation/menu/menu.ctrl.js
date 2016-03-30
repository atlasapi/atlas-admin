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

    allMenu.push({
      path: '/epg/bt-tv',
      label: 'EPG'
    });

    allMenu.push({
      path: '/feeds',
      label: 'Feeds'
    });

    allMenu.push({
      path: '/scrubbables',
      label: 'Scrubbables'
    });

    // build the menu
    var menu = [];
    var admin_menu = [];

    allMenu.forEach(function(item) {
      if ($scope.isAdmin) {
        if (item.role === 'admin') {
          admin_menu.push(item);
        } else {
          menu.push(item);
        }
      } else {
        // Need to populate content menu based on openam groups
        $log.info('item', item);
      }
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

    $scope.app.menu = buildMenu();
  }

  function throwError(error) {
    console.error(error);
  }
}
