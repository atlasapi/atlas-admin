'use strict'
var app = angular.module('atlasAdmin.controllers.requestSource', []);

/**
 * @controller CtrlRequestSource
 */
app.controller('CtrlRequestSource', ['$scope', '$rootScope', '$routeParams', 'Applications', 'Sources', '$location', 
    function( $scope, $rootScope, $routeParams, Applications, Sources, $location ) {
        // defaults
        $scope.view_title = 'Howdy';
        $scope.app = {};
        $scope.source = {};

        // url params
        var appId    = $routeParams.applicationId,
            sourceId = $routeParams.sourceId;

        // get app info
        Applications.get(appId).then(function(app) {
            $scope.app.name = app.title;
        });

        // get source info
        Sources.get(sourceId).then(function(source){
            console.log(source);
        });
}]);