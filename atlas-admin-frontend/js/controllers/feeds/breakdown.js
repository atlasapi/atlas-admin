'use strict';
var app = angular.module('atlasAdmin.controllers.feeds');

app.controller('CtrlFeedsBreakdown', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q', '$modal',
function($scope, $rootScope, $routeParams, Feeds, $q, $modal) {
  $scope.taskID = $routeParams.taskId;
  
  $scope.showDetails = function() {
    var modalInstance = $modal.open({
      templateUrl: 'partials/feeds/statusDetailModal.html',
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

app.controller('CtrlStatusDetail', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q', '$modalInstance',
function($scope, $rootScope, $routeParams, $q, $modalInstance) {
  
}]);
