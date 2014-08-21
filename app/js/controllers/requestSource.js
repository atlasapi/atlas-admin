'use strict'
var app = angular.module('atlasAdmin.controllers.requestSource', []);

/**
 * @controller CtrlRequestSource
 */
app.controller('CtrlRequestSource', ['$scope', '$rootScope', '$routeParams', 'Applications', 'Users', '$location', 
    function( $scope, $rootScope, $routeParams, Applications, Users, $location ) {
        // defaults
        $scope.view_title = 'Howdy';
        $scope.app = {};
        $scope.source = {};
        $scope.user = {};

        // url params
        var appId    = $routeParams.applicationId,
            sourceId = $routeParams.sourceId;

        // get app and source data
        Applications.get(appId).then(function(app) {
            var sources = app.sources.reads;
            var source = _.find(sources, function(src) {
                return src.id === sourceId;
            });
            console.log(app);

            // pass app, source data to the view
            $scope.app.name         = app.title;
            $scope.app.description  = app.description;
            $scope.source.title     = source.title;

        })

        // get user information
        Users.currentUser().then( function(user) {
            // pass user data to the view
            $scope.user = user;

            console.log(user);
        })
}]);