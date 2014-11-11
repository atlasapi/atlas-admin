var app = angular.module('atlasAdmin.controllers.feeds');

app.controller('CtrlFeedsBreakdown', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q', '$modal',
    function($scope, $rootScope, $routeParams, Feeds, $q, $modal) {
    $scope.transactionID = $routeParams.transactionId;

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