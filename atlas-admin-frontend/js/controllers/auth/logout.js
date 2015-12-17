'use strict';
var app = angular.module('atlasAdmin.controllers.auth');

app.controller('CtrlLogout', function($scope, $rootScope, $routeParams, $location, Authentication) {
    // Ask atlas for access here
    $rootScope.title = "Logging out";
    Authentication.reset();
    $location.path("/login");
    Cookies.remove('iPlanetDirectoryPro');
});
