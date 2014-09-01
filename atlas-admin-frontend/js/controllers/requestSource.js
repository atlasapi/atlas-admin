'use strict'
var app = angular.module('atlasAdmin.controllers.requestSource', []);

app.controller('CtrlRequestSource', ['$scope', '$rootScope', '$routeParams', 'Applications', 'Users', 'factorySourcePayments', 'factorySourceRequests', '$location', 
    function( $scope, $rootScope, $routeParams, Applications, Users, factorySourcePayments, factorySourceRequests, $location) {
        var appData, userData, sourceData, planData;
        $scope.planData = factorySourcePayments();
        $scope.app = {};
        $scope.plan = 0;
        $scope.source = {};
        $scope.user = {};

        // read url params
        var appId    = $routeParams.applicationId,
            sourceId = $routeParams.sourceId;

        // use provider to get source data, then pass result to $scope
        Applications.get(appId).then(function(app) {
            var sources = app.sources.reads;
            var source = _.find(sources, function(src) {
                return src.id === sourceId;
            });
            $scope.source = source;
            $scope.app = {
                app_id: app.id,
                name: app.title,
                url: app.url,
                description: app.description
            }
            appData = app;
            sourceData = source;
        });

        // use provider to get user data, then pass result to $scope
        Users.currentUser().then( function(user) {
            $scope.user = {
                user_id: user.id,
                full_name: user.full_name,
                company: user.company,
                email: user.email,
                website: user.website
            }
            userData = user;
        });

        // when user switches between payment methods, update the model
        $scope.changeOfPlan = function(index) {
            $scope.plan = index;
            planData = $scope.planData[index];
        }

        // construct post payload, then send to the provider
        $scope.send = function() {
            var payload = {
                user: userData,
                app: appData,
                plan: planData,
                source: sourceData,
                reason: $scope.reason,
                state: 'not approved'
            }
            factorySourceRequests.postRequest(payload).then(function(status) {
                if (status === 200)
                    $location.path('/applications/'+appId);
            });
        };

        // on cancel, change location to application screen
        $scope.cancel = function() {
            $location.path('/applications/'+appId);
        }
}]);