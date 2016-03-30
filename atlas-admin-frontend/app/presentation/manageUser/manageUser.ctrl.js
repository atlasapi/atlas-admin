angular
  .module('atlasAdmin.manageUser')
  .controller('UserProfileController', UserProfileController);

function UserProfileController($scope, $rootScope, $routeParams, Users, Applications, $location) {
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
}
