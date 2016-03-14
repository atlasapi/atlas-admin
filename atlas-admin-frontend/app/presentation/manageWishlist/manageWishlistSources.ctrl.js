angular.module('atlasAdmin.manageWishlist')
  .controller('CtrlManageWishlistSources', ['$scope', '$rootScope', '$modal',
    function($scope, $rootScope, $modal) {

    // filter out source wishes, then pass to the $scope
    $rootScope.$watch('items', function(old_val, new_val) {
        $scope.sources = _.filter($rootScope.items, function(n) {
            return n.type === 'source';
        });
    });

    // instantiate a modal window
    $scope.newSourceItem = function() {
        $scope.modal = {};
        $scope.modal.type = 'Source' ;
        $scope.modal.title = "Add new source";

        var modalInstance = $modal.open({
            templateUrl: 'app/presentation/manageWishlist/newWishlistItemModal/newWishlistItemModal.tpl.html',
            controller: 'CtrlNewWishlistItemModal',
            scope: $scope
        })
        .result.then(function(data) {
            $scope.sources.push(data);
        });
    }
  }]);
