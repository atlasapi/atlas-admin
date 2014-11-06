var app = angular.module('atlasAdmin.controllers.epgWidget', []);

app.controller('CtrlEPGWidget', ['$scope', '$rootScope', '$routeParams', '$q',
    function($scope, $rootScope, $routeParams, $q) {
    $scope.view_title = "BT Blackout widget";

    $.getScript('http://widgets.metabroadcast.com/loader/1/load.js', function() {
        MBST = MBST || {};
        MBST.load({
            client: 'btblackout',
            widgets: [{
                name: 'epg',
                version: '1',
                modules: {
                    grid: {
                        holder: '.epg-widget'
                    }
                }
            }]
        });
    });

}]);