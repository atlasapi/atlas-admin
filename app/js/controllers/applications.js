'use strict';
var app = angular.module('atlasAdmin.controllers.applications', []);

app.controller('CtrlApplications', function($scope, $rootScope, $routeParams, Applications, $modal, $location) {
     $rootScope.title = "Current Applications";
     $scope.app = {};

     $scope.app.predicate = 'created';
     $scope.app.reverse = true;
     $scope.app.pageSize=10;
     $scope.app.currentPage = 1;

     Applications.all().then(function(applications) {
         $scope.app.applications = applications;
     });

     $scope.createApplication = function() {
         var modalInstance = $modal.open({
          templateUrl: 'partials/newApplicationModal.html',
          controller: CreateApplicationFormModalCtrl,
          scope: $scope
        });

        modalInstance.result.then(function (application) {
            $location.path('/applications/' + application.id);
         });
     };

    $scope.appSearchFilter = function(application) {
        if (!$scope.query || $scope.query=="") {
            return true;
        }
        // Search on title match or if query is over 10 chars long the api key
        return application.title.toLowerCase().indexOf($scope.query.toLowerCase()) != -1
        || ($scope.query.length > 10 && application.credentials.apiKey.toLowerCase().indexOf($scope.query.toLowerCase()) != -1);
    };
  });
app.controller('CtrlApplicationEdit', function($scope, $rootScope, $routeParams, Applications, Sources, SourceLicenses, $modal, $sce, $log) {
    $scope.app = {};
    $scope.app.edited = {};
    $scope.app.edited = {"meta":false,"precedenceState":false,"precedenceOrder":false};

    var leavingPageText = "You have unsaved changes!";
    window.onbeforeunload = function(){
        if ($scope.app.changed()) {
            return leavingPageText;
        }
    }

    $scope.$on('$locationChangeStart', function(event, next, current) {
        if($scope.app.changed() && !confirm(leavingPageText + "\n\nAre you sure you want to leave this page?")) {
            event.preventDefault();
        }
    });

    Applications.get($routeParams.applicationId).then(function(application) {
       $scope.app.application = application;
       $scope.app.writes = {};
       $scope.app.writes.predicate = 'name';
       $scope.app.writes.reverse = false;

       $rootScope.title = "Edit application";
    });

    $scope.app.changed = function() {
       return $scope.app.edited.meta
           || $scope.app.edited.precedenceState
           || $scope.app.edited.precedenceOrder;
    };

    $scope.app.disableSource = function(source) {
        var reads = [];
        for (var i in $scope.app.application.sources.reads) {
            var readEntry = $scope.app.application.sources.reads[i];
            if (readEntry.id == source.id) {
                readEntry.enabled = "false";
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
                readEntry.enabled = "true";
            }
            reads.push(readEntry);
        }
        $scope.app.application.sources.reads = reads;
        $scope.app.edited.meta = true;
    };

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
            controller: SourceRequestFormModalCtrl,
            scope: $scope
        });

        modalInstance.result.then(function () {
            Applications.get($scope.app.application.id).then(function(application) {
                $scope.app.application = application;
            });
        });
    };

    $scope.enablePrecedence = function() {
        $scope.app.application.sources.precedence='true';
        $scope.app.edited.precedenceState=true;
    };

    $scope.disablePrecedence = function() {
        $scope.app.application.sources.precedence='false';
        $scope.app.edited.precedenceState=true;
        $scope.app.edited.precedenceOrder=false;
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
                $scope.app.errorMessage = "Application title must be at least three characters long";
            } else {
               Applications.update($scope.app.application).then(function() {
                  $scope.successMessage = "Changes saved";
               },function() {
                  $scope.errorMessage = "Sorry, there was an error and your changes could not be saved";
               });
            }
        } else if ($scope.app.edited.precedenceState && !$scope.app.application.sources.precedence == 'false') {
            // precedence has been disabled
            Applications.deletePrecedence($scope.app.application.id).then(function() {
                $scope.successMessage = "Changes saved";
            },function() {
                $scope.errorMessage = "Sorry, there was an error and your changes could not be saved";
            });

        } else if ($scope.app.edited.precedenceState || $scope.app.edited.precedenceOrder) {
            var sourceIdOrder = [];
            for (var i in $scope.app.application.sources.reads) {
                sourceIdOrder.push($scope.app.application.sources.reads[i].id);
            }
            Applications.setPrecedence($scope.app.application.id, sourceIdOrder).then(function() {
                $scope.successMessage = "Changes saved";
            },function() {
                $scope.errorMessage = "Sorry, there was an error and your changes could not be saved";
            });
        }
        $scope.app.edited = {"meta":false,"precedenceState":false,"precedenceOrder":false};
    };

    $scope.app.viewTerms = function (source) {
      // Source Licence is a API name and a T&Cs
      // get a source
      SourceLicenses.get(source.id).then(
        function (data) {
          // not all sources have licenses
          if (data && data.license) {
            // $scope.app.license should be templated
            $scope.app.license = $sce.trustAsHtml(data.license);
          }
          else {
            $scope.app.license = $sce.trustAsHtml('Please contact us for more details regarding access and pricing for this source.');
          }
        },
        function (error) {
          $log.error(error);
        }
      );

      var modalInstance = $modal.open({
        templateUrl: 'partials/viewTermsModal.html',
        controller: ViewTermsCtrl,
        scope: $scope
      });
    };
});
function SourceRequestFormModalCtrl($scope, $modalInstance, Applications, SourceRequests, $log) {
  $scope.item = {};
  $scope.item.invalid = true;
  $scope.app.sourceRequest.usageTypes = [
      {value: 'invalid', label: '<Please select>'},
      {value: 'commercial', label: 'Commercial'},
      {value: 'non_commercial', label: 'Non commercial'},
      {value: 'personal', label: 'Personal'}
  ];
  $scope.app.sourceRequest.reason = '';
  $scope.app.sourceRequest.applicationUrl = '';
  $scope.app.sourceRequest.usageType = 'invalid'; //default value for usage type
  $scope.app.wait = false;
  $scope.ok = function () {
      $scope.app.wait = true;
      SourceRequests.send($scope.app.sourceRequest.source.id,
                            $scope.app.sourceRequest.applicationId,
                            $scope.app.sourceRequest.applicationUrl,
                            $scope.app.sourceRequest.reason,
                            $scope.app.sourceRequest.usageType,
                            true)
        .then(function() {
            $modalInstance.close();
        },
        function(error) {
            $log.error(error);
            $modalInstance.close();
        });
  };

  $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
  };
}

function CreateApplicationFormModalCtrl($scope, $modalInstance, Applications) {
  $scope.app = {};
  $scope.app.title = "";
  $scope.app.wait = false;

  $scope.ok = function () {
      $scope.app.wait = true;
      Applications.create($scope.app.title)
        .then(function(result) {
            if (result.data.application.id) {
                $modalInstance.close(result.data.application);
            }
        });
  };

  $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
  };
}

function ViewTermsCtrl ($scope, $modalInstance, Applications, SourceRequests, $log) {
  $scope.close = function () {
    $modalInstance.dismiss();
  };
}