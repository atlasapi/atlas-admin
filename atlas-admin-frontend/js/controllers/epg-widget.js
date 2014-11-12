var app = angular.module('atlasAdmin.controllers.epgWidget', []);

app.controller('CtrlEPGWidget', ['$scope', '$rootScope', 'Users', '$routeParams', '$q', '$http', 'Authentication', 'atlasApiHost',
    function($scope, $rootScope, Users, $routeParams, $q, $http, Authentication, atlasApiHost) {
    $scope.view_title = "";
    $scope.widget = false;
    $scope.widgetURL = '';

    $http.get( Authentication.appendTokenToUrl(atlasApiHost +'/user/groups') )
    .success(function(groups, status) {
        var key = groups[0].data.apiKey || null;
        if (key) {
            $scope.view_title = "BT Blackout";
            $scope.widget = true;
            $scope.widgetURL = '//widgets.metabroadcast.com/loader/1/btblackout.html?apiKey='+key;
        }
    })
}]);