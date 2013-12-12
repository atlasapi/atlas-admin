'use strict';
var app = angular.module('atlasAdmin.controllers.applications', []);

app.controller('CtrlApplications', function($scope, $rootScope, $routeParams, Applications, $modal, $location) {
     $rootScope.title = "Current Applications";
     $scope.apps = {};
     Applications.all().then(function(applications) {
         $scope.apps.applications = applications; 
     });
     $scope.apps.predicate = '-created';
     $scope.apps.pageSize=10;
     $scope.apps.currentPage = 0;
    
     $scope.createApplication = function() {
         var modalInstance = $modal.open({
          templateUrl: 'partials/newApplicationModal.html',
          controller: CreateApplicationFormModalCtrl,
          scope: $scope
        });

        modalInstance.result.then(function (application) {
            $location.path('/applications/' + application.id);
         });   
     }
  });
app.controller('CtrlApplicationEdit', function($scope, $rootScope, $routeParams, Applications, $modal, $log) {
    $scope.app = {};
    $scope.app.edited = {};
    $scope.app.edited = {"meta":false,"precedenceState":false,"precedenceOrder":false};
    
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
        $scope.app.sourceRequest.source = source;
        $scope.app.sourceRequest.applicationId = $scope.app.application.id;
        var modalInstance = $modal.open({
          templateUrl: 'partials/sourceRequestModal.html',
          controller: SourceRequestFormModalCtrl,
          scope: $scope
        });

        modalInstance.result.then(function () {
            // only modify data if ok pressed on form
            var reads = [];
            // update display, app is updated server side
            for (var i in $scope.app.application.sources.reads) {
                var readEntry = $scope.app.application.sources.reads[i];
                if (readEntry.id == source.id) {
                    readEntry.state = "requested";  
                } 
                reads.push(readEntry);   
            }
            $scope.app.application.sources.reads = reads;
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
      
});
function SourceRequestFormModalCtrl($scope, $modalInstance, Applications, SourceRequests) {
  $scope.item = {};
  $scope.item.invalid = true;
  $scope.app.sourceRequest.usageTypes = [
      {value: 'commercial', label: 'Commercial'},
      {value: 'noncommercial', label: 'Non commercial'},
      {value: 'personal', label: 'Personal'}
  ];
  $scope.app.sourceRequest.reason = '';
  $scope.app.sourceRequest.applicationUrl = '';
  $scope.app.sourceRequest.usageType = 'commercial'; //default value for usage type
  $scope.ok = function () {
      SourceRequests.send($scope.app.sourceRequest.source.id, 
                            $scope.app.sourceRequest.applicationId, 
                            $scope.app.sourceRequest.applicationUrl, 
                            $scope.app.sourceRequest.reason, 
                            $scope.app.sourceRequest.usageType)
        .then(function() {
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
 
  $scope.ok = function () {
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