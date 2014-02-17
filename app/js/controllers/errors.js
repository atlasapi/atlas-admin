'use strict';
var app = angular.module('atlasAdmin.controllers.errors', []);
app.controller('ErrorController', function($scope, $rootScope, $routeParams) {
    $rootScope.title = "Sorry, there was a problem....";
    $scope.alerts = [];
    if ($routeParams.type == "forbidden") {
        $scope.alerts.push({type:"danger", msg: "You do not have access to this resource"});        
    } else if ($routeParams.type == "not_available") {
        $scope.alerts.push({type:"info", msg: "This service is not currently available. Please try again later."});        
    } 
});