'use strict';

angular.module('atlasAdmin.controllers.applications')
.controller('CtrlApplicationEdit', ['$scope', '$rootScope', '$routeParams', 'Applications', 'Sources', 'SourceLicenses', 'Authentication', 'atlasApiHost', '$modal', '$sce', '$log', '$http', '$q', 
    function($scope, $rootScope, $routeParams, Applications, Sources, SourceLicenses, Authentication, atlasApiHost, $modal, $sce, $log, $http, $q) {

    $scope.app = {};
    $scope.app.edited = {};
    $scope.app.edited = {'meta':false,'precedenceState':false,'precedenceOrder':false};
    $scope.app.changed = false;
    var leavingPageText = 'You have unsaved changes!';
    $scope.view_title = 'Edit application';

    window.onbeforeunload = function() {
        if ($scope.app.changed) {
            return leavingPageText;
        }
    };

    $scope.switchTime = function (timeRange) {
        loadGraph(timeRange);
    };

    var $graphContainer = $('#graph-container');

    var loadGraph = function (timeRange) {
        timeRange = timeRange || 'hour';
        showLoadingState();
        $scope.tabState = timeRange;
        $graphContainer.html('<h2>' + timeRange + '</h2>');
        getApplicationId(timeRange);
    };

    var showLoadingState = function () {
        $graphContainer.empty().addClass('loading');
    };

    var removeLoadingState = function () {
        $graphContainer.removeClass('loading');
    };

    var getApplicationId = function (timeRange) {
        // Seems to be the only way to find out the current API key
        Applications.get($routeParams.applicationId).then(function (application) {
            $scope.app.application = application;
            $scope.app.writes = {};
            $scope.app.writes.predicate = 'name';
            $scope.app.writes.reverse = false;
            $scope.view_subtitle = application.title;
            var apiKey = application.credentials.apiKey;
            makeUsageRequest(apiKey, timeRange);
        });
    };

    var makeUsageRequest = function (apiKey, timePeriod) {
        var queryUrl = Authentication.appendTokenToUrl(atlasApiHost +'/usage/' + apiKey + '/' + timePeriod);
        $http.get(queryUrl).success(function (response) {
            console.log(response);
            removeLoadingState();
        });
    };

    $scope.$on('$locationChangeStart', function(event, next, current) {
        if ($scope.app.changed && !confirm(leavingPageText + '\n\nAre you sure you want to leave this page?')) {
            event.preventDefault();
        }
    });

    Applications.get($routeParams.applicationId).then(function(application) {
        $scope.app.application = application;
        $scope.app.writes = {};
        $scope.app.writes.predicate = 'name';
        $scope.app.writes.reverse = false;
        $scope.view_subtitle = application.title;
    });

    $scope.app.disableSource = function(source) {
        var reads = [];
        for (var i in $scope.app.application.sources.reads) {
            var readEntry = $scope.app.application.sources.reads[i];
            if (readEntry.id === source.id) {
                readEntry.enabled = false;
            }
            reads.push(readEntry);
        }
        $scope.app.application.sources.reads = reads;
        $scope.app.edited.meta = true;
    };

    $scope.app.enableSource = function(source) {
        var reads = [];
        for (var i in $scope.app.application.sources.reads) {
            var readEntry = $scope.app.application.sources.reads[i];
            if (readEntry.id == source.id) {
                readEntry.enabled = true;
            }
            reads.push(readEntry);
        }
        $scope.app.application.sources.reads = reads;
        $scope.app.edited.meta = true;
    }

    $scope.app.requestSource = function(source) {
        $scope.app.sourceRequest = {};
        $scope.app.license = null;
        SourceLicenses.get(source.id).then(
            function(data) {
                if (data && data.license) {
                    $scope.app.license = $sce.trustAsHtml(data.license);
                }
            },
            function(error) {
                $log.error(error);
            }
        );
        $scope.app.sourceRequest.source = source;
        $scope.app.sourceRequest.applicationId = $scope.app.application.id;
        var modalInstance = $modal.open({
            templateUrl: 'partials/sourceRequestModal.html',
            controller: 'SourceRequestFormModalCtrl',
            scope: $scope
        });
        modalInstance.result.then(function() {
            Applications.get($scope.app.application.id).then(function(application) {
                $scope.app.application = application;
            });
        });
    };

    $scope.enablePrecedence = function() {
        $scope.app.application.sources.precedence = true;
        $scope.app.edited.precedenceState = true;
    };

    $scope.disablePrecedence = function() {
        $scope.app.application.sources.precedence = false;
        $scope.app.edited.precedenceState = true;
        $scope.app.edited.precedenceOrder = false;
    };

    $scope.revokeApplication = function() {
        Applications.revokeApplication($scope.app.application).then(function(application) {
            $scope.app.application = application;
        });
    };

    $scope.unRevokeApplication = function() {
        Applications.unRevokeApplication($scope.app.application).then(function(application) {
            $scope.app.application = application;
        });
    };

    $scope.save = function() {
        // Decide how to perform the update based on what has changed
        if ($scope.app.edited.meta) {
            if (!$scope.detailsForm.appTitle.$valid) {
                $scope.app.errorMessage = 'Application title must be at least three characters long';
            } else {
                Applications.update($scope.app.application).then(function() {
                    $scope.successMessage = 'Changes saved';
                },
                function() {
                    $scope.errorMessage = 'Sorry, there was an error and your changes could not be saved';
                });
            }
        } else if ($scope.app.edited.precedenceState && !$scope.app.application.sources.precedence) {
            // precedence has been disabled
            Applications.deletePrecedence($scope.app.application.id).then(function() {
                $scope.successMessage = 'Changes saved';
            },
            function() {
                $scope.errorMessage = 'Sorry, there was an error and your changes could not be saved';
            });

        } else if ($scope.app.edited.precedenceState || $scope.app.edited.precedenceOrder) {
            var sourceIdOrder = [];
            for (var i in $scope.app.application.sources.reads) {
                sourceIdOrder.push($scope.app.application.sources.reads[i].id);
            }
            Applications.setPrecedence($scope.app.application.id, sourceIdOrder).then(function() {
                $scope.successMessage = 'Changes saved';
            },
            function() {
                $scope.errorMessage = 'Sorry, there was an error and your changes could not be saved';
            });
        }

        $scope.app.edited = {
            'meta': false,
            'precedenceState': false,
            'precedenceOrder': false
        };

        $scope.app.changed = false;
    };

    $scope.app.viewTerms = function(source) {
        // Source Licence is a API name and a T&Cs
        SourceLicenses.get(source.id).then(function(data) {
            // not all sources have licenses
            if (data && data.license) {
                // $scope.app.license should be templated
                $scope.app.license = $sce.trustAsHtml(data.license);
            }
            else {
                $scope.app.license = $sce.trustAsHtml('Please contact us for more details regarding access and pricing for this source.');
            }
        },
        function(error) {
            $log.error(error);
        });

        var modalInstance = $modal.open({
            templateUrl: 'partials/viewTermsModal.html',
            controller: 'ViewTermsCtrl',
            scope: $scope
        });
    };

    // listen for an event from the orderable list
    // to tell us when it has been updated, and then
    // run the digest
    $scope.$on('precedenceOrder', function() {
        $scope.app.edited.precedenceOrder = true;
        $scope.$digest();
    });

    // deep-watch `app.edited` for changes so that we can reveal
    // the save button when something has changed
    $scope.$watch('app.edited', function(newVal) {
        angular.forEach(newVal, function(val) {
            if (val) {
                $scope.app.changed = true;
            }
            return;
        });
    }, true);

    // @TODO: if the user changes the model back to the way how it was
    // before the UI was touched, `app.changed` should be `false`
}]);
