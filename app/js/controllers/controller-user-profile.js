'use strict';

/* User Profile Controller */

var app = angular.module('atlasAdmin.controller.user', []);
app.controller('UserProfileController', function($scope, $rootScope, $routeParams, Users) {
    $rootScope.title = "Your profile";
    $scope.app = {};
    Users.currentUser().then(function(user) {
        $scope.app.user = user;  
    });
    
    $scope.save = function() {
        if ($scope.userForm.$invalid) {
            return;
        }
        $scope.app.changed = false;
        Users.update($scope.app.user).then(function() {
            $scope.successMessage = "Changes saved"; 
        },
        function() {
            $scope.errorMessage = "Sorry, there was an error and your changes could not be saved";
        });
    }
});