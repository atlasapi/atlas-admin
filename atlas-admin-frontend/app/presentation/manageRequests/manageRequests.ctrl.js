'use strict'
angular.module('atlasAdmin.manageRequests')
  .controller('CtrlManageSourceRequests', ['$scope', '$rootScope', '$routeParams', 'Applications', 'Users', 'sourceRequests', '$location',
    function($scope, $rootScope, $routeParams, Applications, Users, sourceRequests, $location) {
    $scope.app = {};
    $scope.app.requests = {};

    // 'orderBy' helper for sorting requests by source name
    // $scope.sortBySourceName = function(val) {
    //     console.log(val.source.title);
    //     return val.source.title;
    // }

    // send request to approve source to the server, then remove the request
    // from the list
    // @param appId {string}  the `app.id` value from mongo
    // @param sourceId {string}  the `source.id` value from mongo
    // @param state {string}  new state of request (defaults to 'approved')
    var changeRequestState = function(appId, sourceId, state) {
        if (!_.isString(appId) && !_.isString(sourceId)) return false;
        var payload = {
            appId: appId,
            sourceId: sourceId,
            new_state: state || 'approved'
        }
        sourceRequests.putChangeRequest(payload).then(function(status) {
            if (status.ok && status.n === 1) {
                _.remove($scope.app.requests, function(n) {
                    return ((n.app.id === appId) && (n.source.id === sourceId));
                })
            }
        })
    }

    $scope.approveRequest = function(appId, sourceId, $event) {
        if (typeof $event !== 'undefined') $($event.currentTarget).addClass('xhr-progress');
        return changeRequestState(appId, sourceId, 'approved');
    }

    // pull request data from the api and push result into the $scope
    sourceRequests.getUnapprovedRequests().then(function(data) {
        $scope.app.requests = data;
    });
}]);
