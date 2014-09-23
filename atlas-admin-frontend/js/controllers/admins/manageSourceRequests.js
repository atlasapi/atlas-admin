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

    // send request to approve source to the server, then remove the request
    // from the list
    // @param id {string}  the `_id` value from mongo
    // @param request_id {string}  the `request.id` value from mongo
    // @param state {string}  new state of request (defaults to 'approved')
    var changeRequestState = function(id, request_id, state) {
        if (typeof id !== 'string') return false;        
        var payload = {
            id: id,
            request_id: request_id, 
            new_state: state || 'approved'
        }
        factorySourceRequests.putChangeRequest(payload).then(function(status) {
            if (status.ok && status.n === 1) {
                _.remove($scope.app.requests, function(n) {
                    return n._id === id;
                })
            }
        })
    }

    $scope.approveRequest = function(id, request_id, $event) {
        if (typeof $event !== 'undefined') $($event.currentTarget).addClass('xhr-progress');
        return changeRequestState(id, request_id, 'approved');
    }

    // pull request data from the api and push result into the $scope
    factorySourceRequests.getUnapprovedRequests().then(function(data) {
        $scope.app.requests = data;
    });
}])