'use strict';

/* User Profile Controller */

var app = angular.module('atlasAdmin.controllers.user', []);
app.controller('UserProfileController', function($scope, $rootScope, $routeParams, Users, Applications) {
    
    $scope.app = {};
    
    $scope.app.isAdmin = false;
    $scope.app.predicate = 'created';
    $scope.app.reverse = true;
    $scope.app.pageSize=10;
    $scope.app.currentPage = 1;
    
    var populateApplications = function(idList) {
        $scope.app.applications = [];
        for (var i=0; i<idList.length; i++) {
            Applications.get(idList[i]).then(function(application) {
               $scope.app.applications.push(application);
            });
        }
    }
    
    
    if ($routeParams.uid) {
        Users.get($routeParams.uid).then(function(user) {
            $scope.app.user = user;
            var title = "Profile for ";
            if (user.full_name) {
                title += user.full_name;
            } else {
                title += "user id " + user.id;
            }
            $rootScope.title = title;
            Users.currentUser().then(function(editingUser) {
                $scope.app.isAdmin = editingUser.role == "admin";
                $scope.app.editingUser = editingUser.id;
                
                if ($scope.app.isAdmin) {
                    populateApplications($scope.app.user.applications);
                }
            });
        });
    } else {
        Users.currentUser().then(function(user) {
            $scope.app.user = user;
            $rootScope.title = "Your profile";
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
    $scope.app.predicate = 'full_name';
    $scope.app.reverse = false;
    $scope.app.pageSize=10;
    $scope.app.currentPage = 1;
});
app.controller('UserMenuController', function($scope, Users, $rootScope, Authentication, $location) {
    // only try to get user if logged in
    $scope.app = {};
    
    var buildMenu = function(user, currentPath) {
          var allMenu = [{path:'/applications', label:'Applications'},
                {path:'/sources', label:'Sources', role:'admin'},
                {path:'/requests', label:'Requests', role:'admin'},
                {path:'/users', label:'Users', role:'admin'}];  
    
            var menu = [];    
            for (var i=0; i<allMenu.length; i++) {
                var item = allMenu[i];
                item.active = item.path == currentPath;
                if (!item.role || item.role == user.role) {
                    menu.push(item);
                }
            }
        return menu;
    };
    
    if (Authentication.getToken()) {
        Users.currentUser().then(function(user) {
            $scope.app.user = user;
            $scope.app.menu = buildMenu($scope.app.user, $location.path());
        });
    }
    
    $scope.app.move = function(path) {
        $scope.app.menu = buildMenu($scope.app.user, path);
        $location.path(path);
    };
});
app.controller('UserLicenseController', function($scope, $rootScope, $routeParams, Users, $location, $window, $sce, $log) {
    // only try to get user if logged in
    $scope.app = {};
    Users.currentUser().then(function(user) {
        $scope.app.user = user;
        $rootScope.title = "Atlas usage guidelines, terms and conditions";
    });    
    
    var error = function(error) {
        $log.error(error);
        $window.location.href = "/#/error?type=not_available";
    };
    
    Users.getTermsAndConditions().then(function(license) {
        $scope.app.license = $sce.trustAsHtml(license);
    }, error);
    
    $scope.app.accept = function() {
       Users.acceptTermsAndConditions($scope.app.user.id).then(function(data) {
          $location.path("/profile"); 
       }, error);
    };
    
    $scope.app.reject = function() {
        $location.path("/logout"); 
    }
});
