'use strict';

/* Controllers */

var app = angular.module('atlasAdmin.controllers', []);
app.controller('CtrlSources', function($scope, $rootScope, $routeParams, Sources) {
      $rootScope.title = "Sources";
      $rootScope.showFilter = true;
      // TODO clear filter
      $scope.sources = Sources.all();
  });
app.controller('CtrlSourceReaders', function($scope, $rootScope, $routeParams, Sources, Applications) {
      $rootScope.showFilter = true;
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
      $rootScope.showFilter = true;
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
app.controller('CtrlRequests', function($scope, $rootScope, $routeParams) {
     $rootScope.title = "Requests";
  })
app.controller('CtrlApplications', function($scope, $rootScope, $routeParams, Applications) {
     $rootScope.title = "Current Applications";
     $scope.apps = {};
     Applications.all().then(function(applications) {
         $scope.apps.applications = applications; 
     });
     $scope.apps.predicate = '-created';
     $scope.apps.pageSize=15;
     $scope.apps.currentPage = 0;
  });
app.controller('CtrlApplicationEdit', function($scope, $rootScope, $routeParams, Applications) {
    $scope.app = {};
    Applications.get($routeParams.applicationId).then(function(application) {
       $rootScope.showFilter = false;
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
    };
    
    $scope.app.requestSource = function(source) {
        // TODO POP UP A FORM TO REQUEST ACCESS + WRITE SOURCE REQUESTS
       var reads = [];
        for (var i in $scope.app.application.sources.reads) {
            var readEntry = $scope.app.application.sources.reads[i];
            if (readEntry.id == source.id) {
                readEntry.state = "requested";  
            } 
            reads.push(readEntry);   
        }
        $scope.app.application.sources.reads = reads; 
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