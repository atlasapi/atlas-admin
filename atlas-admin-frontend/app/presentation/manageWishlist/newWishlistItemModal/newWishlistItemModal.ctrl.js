angular.module('atlasAdmin.manageWishlist')
  .controller('CtrlNewWishlistItemModal', ['$scope', '$rootScope', '$modalInstance', 'factoryPropositions',
      function($scope, $rootScope, $modalInstance, Propositions) {
      $scope.formdata = {};
      $scope.formdata.status = 'not available';
      $scope.submit = function() {
          if ('string' !== typeof $scope.formdata.name
              && 'string'!== typeof $scope.formdata.status) {
              return false;
          }
          var data = {
              "type": $scope.modal.type.toLowerCase(),
              "title": $scope.formdata.name,
              "status": $scope.formdata.status
          }
          Propositions.create(data).then(function(data) {
              $modalInstance.close(data);
          });
      }
      $scope.cancel = function() {
          $modalInstance.dismiss();
      }
  }]);
