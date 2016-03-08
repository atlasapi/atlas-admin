'use strict';

angular.module('atlasAdmin.application')
.controller('ViewTermsCtrl', ['$scope', '$modalInstance', 'Applications', 'sourceRequests', '$log',
    function($scope, $modalInstance, Applications, sourceRequests, $log) {
      $scope.close = function() {
          $modalInstance.dismiss();
      };
    }]);
