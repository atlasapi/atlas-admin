'use strict'
var app = angular.module('atlasAdmin.controllers.requestSource', []);

app.controller('CtrlRequestSource', ['$scope', '$rootScope', '$routeParams', 'Applications', 'Users', 'factorySourcePayments', 'factorySourceRequests', '$location', 
    function( $scope, $rootScope, $routeParams, Applications, Users, factorySourcePayments, factorySourceRequests, $location) {
        $scope.planData = factorySourcePayments();
        $scope.button_txt = 'Accept';
        $scope.app = {};
        $scope.plan = 0;
        $scope.source = {};
        $scope.user = {};

        $scope.isNumber = function (value) {
          return angular.isNumber(value);
        };

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
            $scope.app = app;
        });

        // use provider to get user data, then pass result to $scope
        Users.currentUser().then( function(user) {
            $scope.user = user;
        });

        // when user switches between payment methods, update the model
        $scope.changeOfPlan = function(index) {
            $scope.plan = index;
        }

        // construct post payload, then send to the provider
        $scope.send = function() {
            $scope.button_txt = 'Sending...';
            var payload = {
                user: $scope.user,
                app: $scope.app,
                plan: $scope.planData[$scope.plan],
                source: $scope.source,
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