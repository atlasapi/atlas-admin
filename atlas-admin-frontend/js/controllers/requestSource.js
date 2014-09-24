'use strict'
var app = angular.module('atlasAdmin.controllers.requestSource', []);

app.controller('CtrlRequestSource', ['$scope', '$rootScope', '$sce', '$routeParams', 'Applications', 'Users', 'factorySourcePayments', 'factorySourceRequests', 'SourceLicenses', '$location', 
    function( $scope, $rootScope, $sce, $routeParams, Applications, Users, factorySourcePayments, factorySourceRequests, SourceLicenses, $location) {
        $scope.planData = factorySourcePayments();
        $scope.button_txt = 'Accept';
        $scope.app = {};
        $scope.plan = 0;
        $scope.source = {};
        $scope.user = {};

        $scope.isNumber = function (value) {
          return angular.isNumber(value);
        };

        // used for referencing url params
        var appId    = $routeParams.applicationId,
            sourceId = $routeParams.sourceId;

        var getTerms = function(sourceId, callback) {
            SourceLicenses.get(sourceId).then(function(data) {
                callback(data);
            }, function(err) { callback(null); })
        }

        // use provider to get source data, then pass result to $scope
        Applications.get(appId).then(function(app) {
            var sources = app.sources.reads;
            var source = _.find(sources, function(src) {
                return src.id === sourceId;
            });
            $scope.source = source;
            $scope.app = app;
            getTerms(source.id, function(terms) {
                $scope.source.terms = _.isObject(terms)? $sce.trustAsHtml(terms.license) : null;
            })
        })

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