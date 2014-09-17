'use strict';

// define 'applications' module to be used for application controllers
angular.module('atlasAdmin.controllers.applications', []);


angular.module('atlasAdmin.controllers.applications')
.controller('CtrlApplications', ['$scope', '$rootScope', '$routeParams', 'Applications', '$modal', '$location',
    function($scope, $rootScope, $routeParams, Applications, $modal, $location) {

    $scope.view_title = 'My Applications';
    $scope.app = {};
    $scope.app.predicate = 'created';
    $scope.app.reverse = true;
    $scope.app.pageSize = 10;
    $scope.app.currentPage = 1;

    // retreive a list of all apps 
    Applications.all().then(function(applications) {
        $scope.app.applications = applications;
        $scope.state = (applications.length) ? 'table' : 'blank';
    });

    // instantiate a new modal window
    $scope.createApplication = function() {
        var modalInstance = $modal.open({
            templateUrl: 'partials/newApplicationModal.html',
            controller: 'CreateApplicationFormModalCtrl',
            scope: $scope
        });
        modalInstance.result.then(function(application) {
            // if all sources are selected, go to edit page
            if ( 'all' === application.source ) { 
                $location.path('/applications/' + application.id);
            }else{
                $scope.app.applications.push(application)
            }
        });
    };

    $scope.appSearchFilter = function(application) {
        if (!$scope.query || $scope.query === '') {
            return true;
        }
        // Search on title match or if query is over 10 chars long the api key
        return application.title.toLowerCase().indexOf($scope.query.toLowerCase()) !== -1
                || ($scope.query.length > 10 && application.credentials.apiKey.toLowerCase().indexOf($scope.query.toLowerCase()) !== -1);
    };
}]);