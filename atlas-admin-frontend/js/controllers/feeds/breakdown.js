var app = angular.module('atlasAdmin.controllers.feeds');

app.controller('CtrlFeedsBreakdown', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q', '$modal',
    function($scope, $rootScope, $routeParams, Feeds, $q, $modal) {
    $scope.transactionID = $routeParams.transactionId;

    $scope.actions = {};
    $scope.actions.acceptModal = function(action) {
        if (!_.isString(action)) return;

        var _content = {
            title: 'Are you sure you want to <strong>'+action+'</strong> transaction '+$scope.transactionID+'?',
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

    var loadTransaction = function() {
        Feeds.request('youview/bbc_nitro/transactions/'+$routeParams.transactionId+'.json?annotations=status_detail')
            .then(function(transaction) {
                var _transaction = transaction.transactions[0];
                $scope.transaction = _transaction;
                $scope.view_title = "Breakdown for transaction: "+_transaction.id;
            });
    }
    loadTransaction();

}])

app.controller('CtrlStatusDetail', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q', '$modalInstance',
    function($scope, $rootScope, $routeParams, $q, $modalInstance) {
        
}])