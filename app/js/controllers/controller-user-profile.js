'use strict';

/* User Profile Controller */

var app = angular.module('atlasAdmin.controller.user', []);
app.controller('UserProfileController', function($scope, $rootScope, $routeParams, Users) {
    $rootScope.title = "Your profile";
    $scope.app = {};
    if ($routeParams.uid) {
        Users.get($routeParams.uid).then(function(user) {
             $scope.app.user = user;
        });
    } else {
        Users.currentUser().then(function(user) {
             $scope.app.user = user;
        });
    }
    
    $scope.save = function() {
        if ($scope.userForm.$invalid) {
            return;
        }
        $scope.app.changed = false;
        $scope.app.user.profile_complete = true;
        Users.update($scope.app.user).then(function() {
            $scope.successMessage = "Changes saved"; 
        },
        function() {
            $scope.errorMessage = "Sorry, there was an error and your changes could not be saved";
        });
    }
});
app.controller('AllUsersController', function($scope, $rootScope, $routeParams, Users) {
    $rootScope.title = "All users";
    $scope.app = {};
    Users.all().then(function(users) {
         $scope.app.users = users;
    });
    $scope.app.predicate = '-full_name';
    $scope.app.pageSize=15;
    $scope.app.currentPage = 0;
})