'use strict';
angular.module('atlasAdmin.feedBreakdown')
  .controller('CtrlFeedsBreakdown', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q', '$uibModal',
    function($scope, $rootScope, $routeParams, Feeds, $q, $uibModal) {
      $scope.taskID = $routeParams.taskId;

      $scope.showDetails = function() {
        var modalInstance = $uibModal.open({
          templateUrl: 'presentation/feedBreakdown/statusDetailModal/statusDetailModal.tpl.html',
          controller: 'CtrlStatusDetail',
          scope: $scope
        });
        modalInstance.result.then(function() {

        });
      };

      var loadTask = function() {
        Feeds.request('youview/bbc_nitro/tasks/'+$routeParams.taskId+'.json?annotations=remote_responses')
        .then(function(task) {
          var _task = task.tasks[0];
          $scope.task = _task;
          $scope.view_title = "Breakdown for transaction: "+_task.remote_id;
        });
      };
      loadTask();

    }]);
