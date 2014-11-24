var app = angular.module('atlasAdmin.controllers.feeds');

app.controller('CtrlFeedsBreakdown', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q', '$modal',
    function($scope, $rootScope, $routeParams, Feeds, $q, $modal) {
    $scope.taskID = $routeParams.taskId;

    $scope.actions = {};
    $scope.actions.acceptModal = function(action) {
        if (!_.isString(action)) return;

        var _content = {
            title: 'Are you sure you want to <strong>'+action+'</strong> task '+$scope.taskID+'?',
            action: action.charAt(0).toUpperCase() + action.slice(1)
        }

        var _modalInstance = $modal.open({
            template: '<h1>'+_content.title+'</h1></div><div class="feed-modal-options"><button>'+_content.action+'</button><button ng-click="dismiss()">Cancel</button>',
            controller: 'CtrlFeedsAcceptModal',
            windowClass: 'feedsAcceptModal'
        });

        // TODO: decide on action to run
    }

    $scope.showDetails = function() {
        var modalInstance = $modal.open({
            templateUrl: 'partials/feeds/statusDetailModal.html',
            controller: 'CtrlStatusDetail',
            scope: $scope
        });
        modalInstance.result.then(function() {
 
        });
    }

    var loadTask = function() {
        Feeds.request('youview/bbc_nitro/tasks/'+$routeParams.taskId+'.json?annotations=remote_responses')
            .then(function(task) {
                var _task = task.tasks[0];
                $scope.task = _task;
                $scope.view_title = "Breakdown for transaction: "+_task.remote_id;
            });
    }
    loadTask();

}])

app.controller('CtrlStatusDetail', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q', '$modalInstance',
    function($scope, $rootScope, $routeParams, $q, $modalInstance) {
        
}])