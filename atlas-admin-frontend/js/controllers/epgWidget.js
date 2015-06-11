var app = angular.module('atlasAdmin.controllers.epgwidget', []);

app.controller('CtrlEPGWidget', ['$scope', '$rootScope', 'Users', '$routeParams', '$q', '$http', 'Authentication', 'atlasApiHost',
    function($scope, $rootScope, Users, $routeParams, $q, $http, Authentication, atlasApiHost) {
    var subdomain = window.location.hostname.split('.')[0],
        _env = (subdomain === 'stage' || subdomain === 'dev')? '-stage' : '';
    $scope.view_title = "";
    $scope.widget = false;
    $scope.widgetURL = '';

    $http.get( Authentication.appendTokenToUrl(atlasApiHost +'/user/groups') )
    .success(function(groups, status) {
        var groupname, key;
        for ( var g in groups ) {
            groupname = groups[g].name;
            if (groupname === 'BTBlackout') {
                key = groups[g].data.apiKey || null;
                if (key) {
                    $scope.view_title = "BT Blackout";
                    $scope.widget = true;
                    $scope.widgetURL = '//widgets'+_env+'.metabroadcast.com/loader/1/btblackout.html?apiKey='+key;
                }
            }
        }
    })
}]);
