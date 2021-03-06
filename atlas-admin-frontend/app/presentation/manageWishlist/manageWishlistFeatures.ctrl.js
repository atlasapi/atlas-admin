app.controller('CtrlManageWishlistFeatures', ['$scope', '$rootScope', '$uibModal',
    function($scope, $rootScope, $uibModal) {

    // filter out source wishes, then pass to the $scope
    $rootScope.$watch('items', function(old_val, new_val) {
        $scope.features = _.filter($rootScope.items, function(n) {
            return n.type === 'feature';
        });
    });

    // instantiate a modal window
    $scope.newFeatureItem = function() {
        $scope.modal = {};
        $scope.modal.type = 'Feature' ;
        $scope.modal.title = "Add new feature";

        var modalInstance = $uibModal.open({
            templateUrl: 'presentation/manageWishlist/newWishlistItemModal/newWishlistItemModal.tpl.html',
            controller: 'CtrlNewWishlistItemModal',
            scope: $scope
        })
        .result.then(function(data) {
            $scope.features.push(data);
        });
    }
}]);
