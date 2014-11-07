var app = angular.module('atlasAdmin.controllers.epgWidget', []);

app.controller('CtrlEPGWidget', ['$scope', '$rootScope', 'Users', '$routeParams', '$q',
    function($scope, $rootScope, Users, $routeParams, $q) {
    $scope.view_title = "";
    $scope.widget = false;

    Users.currentUser().then(function(user) {
        if (user.id === 'hk98' || 
            user.id === 'hmbc' || 
            user.id === 'hmjh' || 
            user.id === 'hmjg' || 
            user.id === 'hmjc' ||
            user.id === 'hmcz' ||
            user.id === 'hmbb') {
            $scope.view_title = "BT Blackout widget";
            $scope.widget = true;
        }
    });
    $.getScript('http://widgets-stage.metabroadcast.com/loader/1/load.js', function() {
        MBST = MBST || {};
        MBST.load({
            client: 'btblackout',
            widgets: [
            {
                name: 'epg',
                version: '1',
                modules: {
                    common: {
                        apiKey: '345acf0445f74d16afe23968ca17db4b'
                    },
                    grid: {
                        holder: '.epg-grid',
                        nav: {
                            days: 21,
                            fixed: true
                        }
                    }
                }
            }
            ]
        }, function () {
            if (MBST.ENV === 'prod') {
                var host = 'https://atlas.metabroadcast.com';
                MBST.widgets.epg.common.atlasHost = [host, host, host];
            }
        });
    });

}]);