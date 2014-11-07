var app = angular.module('atlasAdmin.controllers.epgWidget', []);

app.controller('CtrlEPGWidget', ['$scope', '$rootScope', 'Users', '$routeParams', '$q', '$http', 'Authentication', 'atlasApiHost',
    function($scope, $rootScope, Users, $routeParams, $q, $http, Authentication, atlasApiHost) {
    $scope.view_title = "";
    $scope.widget = false;
    $scope.srcURL = ''

    $http.get( Authentication.appendTokenToUrl(atlasApiHost +'/user/permissions') ).then(function(data) {
        $scope.view_title = "BT Blackout widget";
        $scope.widget = true;
        var key = data.data[0].data.apiKey;

        if (data.length) {

        }
    })
}]);