angular.module('atlasAdmin.manageUsers')
  .controller('AllUsersController', function($scope, $rootScope, $routeParams, Users) {
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
