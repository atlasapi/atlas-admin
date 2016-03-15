'use strict';

angular.module('atlasAdmin.application')
.controller('ViewTermsCtrl', ['$scope', '$uibModalInstance',
    function($scope, $uibModalInstance) {
      $scope.close = function() {
          $uibModalInstance.dismiss();
      };
    }]);
