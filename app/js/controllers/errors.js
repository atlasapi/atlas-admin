'use strict';
var app = angular.module('atlasAdmin.controllers.errors', []);
app.controller('ErrorController', function($scope, $rootScope, $routeParams) {
    $rootScope.title = "Error";
    $scope.alerts = [];
    if ($routeParams.type == "forbidden") {
        $scope.alerts.push({type:"danger", msg: "You do not have access to this resource"});        
    }    
});