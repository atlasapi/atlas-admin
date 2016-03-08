'use strict';

angular.module('atlasAdmin.manageSourcesReaders')
  .controller('CtrlSourceReaders', function($scope, $rootScope, $routeParams, Sources, Applications) {
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
