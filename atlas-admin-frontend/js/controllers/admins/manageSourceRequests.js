'use strict'
var app = angular.module('atlasAdmin.controllers.admins.manageSourceRequests', []);

app.controller('CtrlManageSourceRequests', ['$scope', '$rootScope', '$routeParams', 'Applications', 'Users', 'factorySourceRequests', '$location',
    function($scope, $rootScope, $routeParams, Applications, Users, factorySourceRequests, $location) {
    $scope.app = {};
    $scope.app.requests = {};

    // 'orderBy' helper for sorting requests by source name
    $scope.sortBySourceName = function(val) {
        return val.source.title;
    }

    var changeRequestState = function(id, state) {
        var payload = {
            request_id: id,
            new_state: state 
        }
        factorySourceRequests.putChangeRequest(payload).then(function(status) {
            if (status.ok && status.n === 1) {
                console.log('source set to:'+ state)
            }
        })
    }

    $scope.approveRequest = function(request_id) {
        return changeRequestState(request_id, 'approved')
    }

    // request data from the api and push result into the $scope
    factorySourceRequests.getUnapprovedRequests().then(function(data) {
        $scope.app.requests = data;
    });
}])