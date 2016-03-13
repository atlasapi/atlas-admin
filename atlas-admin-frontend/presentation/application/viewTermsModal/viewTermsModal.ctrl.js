'use strict';

angular.module('atlasAdmin.application')
.controller('ViewTermsCtrl', ['$scope', '$modalInstance',
    function($scope, $modalInstance) {
      $scope.close = function() {
          $modalInstance.dismiss();
      };
    }]);
