'use strict';
var app = angular.module('atlasAdmin.controllers.atlas', []);

function ViewTermsCtrl($scope, $modalInstance, Applications, SourceRequests, $log) {
    $scope.close = function() {
        $modalInstance.dismiss();
    };
}