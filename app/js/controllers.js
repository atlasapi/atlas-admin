'use strict';

/* Controllers */

angular.module('atlasAdmin.controllers', []).
  controller('CtrlSources', function($scope, $rootScope, $routeParams, Sources) {
      $rootScope.title = "Sources";
      $rootScope.showFilter = true;
      // TODO clear filter
      $scope.sources = Sources.all();
  })
  .controller('CtrlSourceReaders', function($scope, $rootScope, $routeParams, Sources, Applications) {
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
      
  })
  .controller('CtrlSourceWriters', function($scope, $rootScope, $routeParams, Sources, Applications) {
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
      
  })
  .controller('CtrlRequests', function($scope, $rootScope, $routeParams) {
     $rootScope.title = "Requests";
  })
  .controller('CtrlApplications', function($scope, $rootScope, $routeParams) {
     $rootScope.title = "Applications";
  });


