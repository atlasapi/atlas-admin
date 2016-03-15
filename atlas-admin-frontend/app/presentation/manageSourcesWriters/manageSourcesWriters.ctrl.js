'use strict';

angular.module('atlasAdmin.manageSourcesWriters')
  .controller('CtrlSourceWriters', function($scope, $rootScope, $routeParams, Sources, Applications, $uibModal) {
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

    $scope.addWriterDialog = function () {
      var modalInstance = $uibModal.open({
        templateUrl: 'presentation/manageSourcesWriters/addWriterModal/addWriterModal.html',
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
  });
