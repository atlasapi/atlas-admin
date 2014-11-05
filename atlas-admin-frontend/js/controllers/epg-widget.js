var app = angular.module('atlasAdmin.controllers.epgWidget', []);

app.controller('CtrlEPGWidget', ['$scope', '$rootScope', '$routeParams', '$q',
    function($scope, $rootScope, $routeParams, $q) {
    $scope.view_title = "BT Blackout widget";
}]);