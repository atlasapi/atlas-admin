'use strict';
var app = angular.module('atlasAdmin.controllers.sources', []);
app.controller('CtrlSources', function($scope, $rootScope, $routeParams, Sources) {
      $rootScope.title = "Sources";
      $scope.app = {};
      Sources.all().then(function(sources) {
          $scope.app.sources = sources;
          $scope.app.predicate='name'; 
          $scope.app.reverse=false;
          $scope.app.pageSize=10;
          $scope.app.currentPage = 1;
      });
  });
app.controller('CtrlSourceReaders', function($scope, $rootScope, $routeParams, Sources, Applications) {
      $scope.app = {};
      Sources.get($routeParams.sourceId).then(function(source) {
         $rootScope.title = source.name; 
         $scope.app.source = source;
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
          $scope.app.applications = sourceSpecificApplications; 
          $scope.app.predicate = "title";
          $scope.app.reverse=false;
          $scope.app.pageSize=10;
          $scope.app.currentPage = 1;
      });
      $scope.approveClicked = function (application) {
          Sources.changeAppState(application.sourceId, application.id, "available", function() {
              application.state = "available";
          });
      }
      
  });
app.controller('CtrlSourceWriters', function($scope, $rootScope, $routeParams, Sources, Applications, $modal) {
      $scope.app = {};
      Sources.get($routeParams.sourceId).then(function(source) {
         $rootScope.title = source.name; 
         $scope.app.source = source;
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
          $scope.app.applications = sourceSpecificApplications; 
          $scope.app.predicate = "title";
          $scope.app.reverse=false;
          $scope.app.pageSize=10;
          $scope.app.currentPage = 1;
      });
      $scope.approveClicked = function (application) {
          Sources.changeAppState(application.sourceId, application.id, "available", function() {
              application.state = "available";
          });
      }
      
  });

var AddWriterCtrl = function ($scope, $modal, $log, Applications, Sources) {
   $scope.addWriterDialog = function () {
     var modalInstance = $modal.open({
       templateUrl: 'partials/addWriterModal.html',
       controller: AddWriterTypeaheadCtrl
     });
 
     modalInstance.result.then(function (selectedItem) {
         Sources.addWriter($scope.app.source.id, selectedItem.id, function() {
            $scope.app.applications.push(selectedItem);
            $scope.successMessage = selectedItem.title + " now has write access to this source.";
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
  $scope.app = {};
  $scope.app.wait = true;
  Applications.all().then(function(applications) {
      $scope.app.wait = false;
      $scope.applications = applications;
  });
    
  $scope.ok = function () {
      $scope.app.wait = true;
      $modalInstance.close($scope.item.selected);
  };

  $scope.cancel = function () {
      $scope.app.wait = true;
      $modalInstance.dismiss('cancel');
  };
    
  $scope.onSelect = function ($item, $model, $label) {
      $scope.item.invalid = false;
  }
  
  $scope.selectionChanged = function() {
      $scope.item.invalid = true; 
  }
}
