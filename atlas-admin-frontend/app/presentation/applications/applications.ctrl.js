'use strict';

angular.module('atlasAdmin.applications')
.controller('CtrlApplications', ['$scope', '$rootScope', '$routeParams', 'Applications', '$uibModal', '$location', 'Atlas', 'Authentication', 'atlasApiHost', '$http',
    function($scope, $rootScope, $routeParams, Applications, $uibModal, $location, Atlas, Authentication, atlasApiHost, $http) {

    $scope.view_title = 'My Applications';
    $scope.app = {};
    $scope.app.predicate = 'created';
    $scope.app.reverse = true;
    $scope.app.pageSize = 10;
    $scope.app.currentPage = 1;
    $scope.isAdmin = false;

    Atlas.getRequest('/auth/user.json').then(function (result) {
        if (result.data.user.role === 'admin') {
            $scope.isAdmin = true;
        }
    });

    var getUsageData = function (applications) {
        var TIME_PERIOD = 8;
        var dates = [];
        for (var i = 0, ii = TIME_PERIOD; i < ii; i++) {
          dates.push('logstash-atlas-access-' + moment().subtract(i, 'days').format('YYYY.MM.DD'));
        }
        dates = dates.join(',');
        var numberWithCommas = function (x) {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        };
        $http.get(Authentication.appendTokenToUrl(atlasApiHost + '/usage-list/' + dates)).then(function (response) {
            var usageData =  _.has(response, 'data') ? response.data.aggregations.apiKeys.buckets : null;

            if (! usageData) {
              console.warn('Response data doesnt have the `data` property', response);
              return;
            }

            _.forEach(usageData, function (d) {
                d.readableCount = numberWithCommas(d.doc_count);
            });
            applications = handleNullUsage(applications);
            mapUsageDataToApplications(applications, usageData);
        });
    };

    var handleNullUsage = function (applications) {
        _.forEach(applications, function (application) {
            application.usage = {
                doc_count: 0,
                readableCount: 0
            };
        });
        return applications;
    };

    var mapUsageDataToApplications = function (applications, usageData) {
        applications = _.map(applications, function (application) {
            _.forEach(usageData, function (d) {
                if (application.credentials.apiKey === d.key) {
                    application.usage = d;
                }
            });
        });
    };

    // retreive a list of all apps
    Applications.all().then(function(applications) {
        $scope.app.applications = applications;
        $scope.state = (applications.length) ? 'table' : 'blank';
        getUsageData(applications);
    });

    // instantiate a new modal window
    $scope.createApplication = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'presentation/applications/createModal/applicationCreateModal.tpl.html',
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
