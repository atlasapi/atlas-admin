'use strict'
var app = angular.module('atlasAdmin.controllers.requestSource', []);

/**
 * @controller CtrlRequestSource
 */
app.controller('CtrlRequestSource', ['$scope', '$rootScope', '$routeParams', 'Applications', 'Users', '$location', 
    function( $scope, $rootScope, $routeParams, Applications, Users, $location ) {
        $scope.app = {};
        $scope.plan = 1;
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
            // pass app & source data to the view
            $scope.app.name         = app.title;
            $scope.app.description  = app.description;
            $scope.source.title     = source.title;
        })

        // get current user's information
        Users.currentUser().then( function(user) {
            // pass user data to the view
            $scope.user = user;
        })

        // send form action
        $scope.send = function() {
            var post_data = {
                user: $scope.user,
                app: $scope.app,
                source: $scope.source,
                plan: $scope.plan
            }

            // send to server here
        }

        // cancel form action action
        $scope.cancel = function() {
            $location.path('/applications/'+appId);
        }
}]);