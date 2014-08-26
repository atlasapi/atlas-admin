'use strict'
var app = angular.module('atlasAdmin.controllers.requestSource', []);

/**
 * @controller CtrlRequestSource
 */
app.controller('CtrlRequestSource', ['$scope', '$rootScope', '$routeParams', 'Applications', 'Users', 'SourcePayment', '$location', 
    function( $scope, $rootScope, $routeParams, Applications, Users, SourcePayment, $location ) {
        $scope.planData = SourcePayment();
        $scope.app = {};
        $scope.plan = 1;
        $scope.source = {};
        $scope.user = {};

        console.log( $scope.planData)

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
            $scope.source           = source;
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
            console.log(post_data)
        }

        // cancel form action action
        $scope.cancel = function() {
            $location.path('/applications/'+appId);
        }
}]);