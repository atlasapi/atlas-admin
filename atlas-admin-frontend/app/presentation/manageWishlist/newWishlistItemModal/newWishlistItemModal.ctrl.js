angular.module('atlasAdmin.manageWishlist')
  .controller('CtrlNewWishlistItemModal', ['$scope', '$rootScope', '$uibModalInstance', 'factoryPropositions',
      function($scope, $rootScope, $uibModalInstance, Propositions) {
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
              $uibModalInstance.close(data);
          });
      }
      $scope.cancel = function() {
          $uibModalInstance.dismiss();
      }
  }]);
