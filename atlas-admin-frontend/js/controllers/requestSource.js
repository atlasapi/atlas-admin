'use strict'
var app = angular.module('atlasAdmin.controllers.requestSource', []);

app.controller('CtrlRequestSource', ['$scope', '$rootScope', '$routeParams', 'Applications', 'Users', 'factorySourcePayments', 'factorySourceRequests', '$location', 
    function( $scope, $rootScope, $routeParams, Applications, Users, factorySourcePayments, factorySourceRequests, $location) {
        $scope.planData = factorySourcePayments();
        $scope.app = {};
        $scope.plan = 0;
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
            // make the application and source data available to the $scope
            $scope.source = source;
            $scope.app = {
                app_id: app.id,
                name: app.title,
                url: app.url,
                description: app.description
            }
        });

        // push the current user's info into the $scope
        Users.currentUser().then( function(user) {
            $scope.user = {
                user_id: user.id,
                full_name: user.full_name,
                company: user.company,
                email: user.email,
                website: user.website
            }
        });

        // when user switches between payment methods, update the model
        $scope.changeOfPlan = function(index) {
            $scope.plan = index;
        }

        // construct data object, then send to server
        $scope.send = function() {
            var plan_select = $scope.planData[$scope.plan];
            var post_data = {
                user: $scope.user,
                app: $scope.app,
                plan: plan_select,
                source: $scope.source
            }
            factorySourceRequests.post(post_data).then(function(status) {
                if (status === 200)
                    $location.path('/applications/'+appId);
            });
        };

        // cancel form action action
        $scope.cancel = function() {
            $location.path('/applications/'+appId);
        }
}]);