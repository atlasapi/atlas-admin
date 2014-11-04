var app = angular.module('atlasAdmin.controllers.feeds');

app.controller('CtrlFeedsBreakdown', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q',
    function($scope, $rootScope, $routeParams, Feeds, $q) {

    $scope.transactionID = $routeParams.transactionId;

    Feeds.request('youview/bbc_nitro/transactions/'+$routeParams.transactionId+'.json?annotations=status_detail')
    .then(function(transaction) {
        var _transaction = transaction.transactions[0];
        console.log(_transaction)
        $scope.transaction = _transaction;
        $scope.view_title = "Breakdown for "+_transaction.id;
    });

}])