var app = angular.module('atlasAdmin.controllers.sourceRequests', []);
app.controller('CtrlRequests', function($scope, $rootScope, $routeParams, SourceRequests, Applications, $q) {
    $rootScope.title = 'Requests';
    $scope.app = {};
    $scope.app.predicate = 'approved';
    $scope.app.reverse = false;
    $scope.app.pageSize = 10;
    $scope.app.currentPage = 1;
    SourceRequests.all().then(function(requests) {
        var applications = {};
        var appRequests = [];
        var forbidden = [];
        for (var i in requests) {
            if (!applications[requests[i].application_id] && forbidden.indexOf(requests[i].application_id) === -1) {
                applications[requests[i].application_id] = {};
                appRequests.push(Applications.get(requests[i].application_id));
            }
        }
        // get the application details for each requests and merge data
        $q.all(appRequests).then(function(results) {
            for (var i in results) {
               applications[results[i].id] = results[i];
            }
            for (var j in requests) {
               requests[j].application = applications[requests[j].application_id];
            }
            $scope.app.requests = requests;
        });
    });

    $scope.approveRequest = function(request) {
        SourceRequests.approve(request.id)
        .then(function() {
                request.approved = 'true';
            },
            function() {
                $scope.errorMessage = 'Sorry the request could not be approved due to an error';
            }
        );
    };
});