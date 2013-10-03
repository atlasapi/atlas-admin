'use strict';

/* Controllers */

var app = angular.module('atlasAdmin.controllers', []);
app.controller('CtrlSources', function($scope, $rootScope, $routeParams, Sources) {
      $rootScope.title = "Sources";
      $scope.sources = Sources.all();
  });
app.controller('CtrlSourceReaders', function($scope, $rootScope, $routeParams, Sources, Applications) {
      Sources.get($routeParams.sourceId).then(function(source) {
         $rootScope.title = source.name; 
         $scope.source = source;
      });
      
      Applications.all().then(function(applications) {
          var sourceSpecificApplications = [];
          for (var i in applications) {
              var sourceSpecificApplication = {
                  "id": applications[i].id,
                  "title": applications[i].title,
                  "created": applications[i].created
              };
              // find source
              for (var j in applications[i].sources.reads) {
                  if (applications[i].sources.reads[j].id == $routeParams.sourceId) {
                        sourceSpecificApplication.sourceId = $routeParams.sourceId;
                        sourceSpecificApplication.state = applications[i].sources.reads[j].state;
                        sourceSpecificApplication.enabled = applications[i].sources.reads[j].enabled;
                  }
              }
              sourceSpecificApplications.push(sourceSpecificApplication);
          }     
          $scope.applications = sourceSpecificApplications; 
          $scope.predicate = "title";
      });
      $scope.approveClicked = function (application) {
          Sources.changeAppState(application.sourceId, application.id, "available", function() {
              application.state = "available";
          });
      }
      
  });
app.controller('CtrlSourceWriters', function($scope, $rootScope, $routeParams, Sources, Applications, $modal) {
      Sources.get($routeParams.sourceId).then(function(source) {
         $rootScope.title = source.name; 
         $scope.source = source;
      });
      
      Applications.all().then(function(applications) {
          var sourceSpecificApplications = [];
          for (var i in applications) {
              var sourceSpecificApplication = {
                  "id": applications[i].id,
                  "title": applications[i].title,
                  "created": applications[i].created
              };
              // find source
              for (var j in applications[i].sources.writes) {
                  if (applications[i].sources.writes[j].id == $routeParams.sourceId) {
                      sourceSpecificApplications.push(sourceSpecificApplication);
                  }
              }
          }     
          $scope.applications = sourceSpecificApplications; 
          $scope.predicate = "title";
      });
      $scope.approveClicked = function (application) {
          Sources.changeAppState(application.sourceId, application.id, "available", function() {
              application.state = "available";
          });
      }
      
  });
app.controller('CtrlRequests', function($scope, $rootScope, $routeParams, SourceRequests, Applications, $q) {
     $rootScope.title = "Requests";
    $scope.app = {};
    $scope.app.predicate = 'approved';
    $scope.app.reverse = false;
    SourceRequests.all().then(function(requests) {
        var applications = {};
        var appRequests = [];
        var forbidden = [];
        for (var i in requests) {
            if (!applications[requests[i].application_id] && forbidden.indexOf(requests[i].application_id) == -1) {
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
            $scope.errorMessage = "Sorry the request could not be approved due to an error";  
          }
        );
    };
    
  })
app.controller('CtrlApplications', function($scope, $rootScope, $routeParams, Applications, $modal, $location) {
     $rootScope.title = "Current Applications";
     $scope.apps = {};
     Applications.all().then(function(applications) {
         $scope.apps.applications = applications; 
     });
     $scope.apps.predicate = '-created';
     $scope.apps.pageSize=15;
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
app.controller('CtrlApplicationEdit', function($scope, $rootScope, $routeParams, Applications, $modal) {
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
            for (var i in $scope.app.application.sources.reads) {
                var readEntry = $scope.app.application.sources.reads[i];
                if (readEntry.id == source.id) {
                    readEntry.state = "requested";  
                } 
                reads.push(readEntry);   
            }
            $scope.app.application.sources.reads = reads;
            $scope.app.edited.meta = true;
         });
    };
    
   
    
    $scope.save = function() {
        // Decide how to perform the update based on what has changed
        if ($scope.app.edited.meta) {
            if (!$scope.detailsForm.appTitle.$valid) {
                $scope.app.message = "Application title must be at least three characters long";
            } else {
               Applications.update($scope.app.application).then(function() {
                  $scope.app.message = "Changes saved";   
               },function() {
                  $scope.app.message = "Sorry, there was an error and your changes could not be saved";   
               }); 
            }
        } else if ($scope.app.edited.precedenceState && $scope.app.application.sources.precedence == 'false') {
            // precedence has been disabled
            Applications.deletePrecedence($scope.app.application.id).then(function() {
                $scope.app.message = "Changes saved";   
            },function() {
                $scope.app.message = "Sorry, there was an error and your changes could not be saved";   
            }); 
            
        } else if ($scope.app.edited.precedenceState || $scope.app.edited.precedenceOrder) {
            var sourceIdOrder = [];
            for (var i in $scope.app.application.sources.reads) {
                sourceIdOrder.push($scope.app.application.sources.reads[i].id);   
            }
            Applications.setPrecedence($scope.app.application.id, sourceIdOrder).then(function() {
                $scope.app.message = "Changes saved";   
            },function() {
                $scope.app.message = "Sorry, there was an error and your changes could not be saved";   
            }); 
        }  
    };
      
});

var AddWriterCtrl = function ($scope, $modal, $log, Applications, Sources) {


  $scope.addWriterDialog = function () {
    var modalInstance = $modal.open({
      templateUrl: 'partials/addWriterModal.html',
      controller: AddWriterTypeaheadCtrl
    });

    modalInstance.result.then(function (selectedItem) {
        Sources.addWriter($scope.source.id, selectedItem.id, function() {
           $scope.applications.push(selectedItem);
           alert(selectedItem.title + " now has write access to this source.");
        });
    }, function () {
      $log.info('Add writer cancelled at: ' + new Date());
    });
  };
};

function AddWriterTypeaheadCtrl($scope, $modalInstance, Applications) {
  $scope.item = {};
  $scope.item.invalid = true;
  $scope.item.selected = undefined;
  Applications.all().then(function(applications) {
      $scope.applications = applications;
  });
    
  $scope.ok = function () {
      $modalInstance.close($scope.item.selected);
  };

  $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
  };
    
  $scope.onSelect = function ($item, $model, $label) {
      $scope.item.invalid = false;
  }
  
  $scope.selectionChanged = function() {
      $scope.item.invalid = true; 
  }
}


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
      if ($scope.app.sourceRequest.email && $scope.app.sourceRequest.email.indexOf('@') != -1) {
        SourceRequests.send($scope.app.sourceRequest.source.id, 
                            $scope.app.sourceRequest.applicationId, 
                            $scope.app.sourceRequest.applicationUrl, 
                            $scope.app.sourceRequest.email, 
                            $scope.app.sourceRequest.reason, 
                            $scope.app.sourceRequest.usageType)
        .then(function() {
            $modalInstance.close();
        });
      }
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