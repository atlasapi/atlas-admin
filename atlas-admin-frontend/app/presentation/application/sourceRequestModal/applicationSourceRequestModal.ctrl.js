'use strict';

angular.module('atlasAdmin.application')
.controller('SourceRequestFormModalCtrls', ['$scope', '$modalInstance', 'Applications', 'SourceRequests', '$log',
    function($scope, $modalInstance, Applications, SourceRequests, $log) {

    $scope.item = {};
    $scope.item.invalid = true;
    $scope.app.sourceRequest.usageTypes = [
        {value: 'invalid', label: '<Please select>'},
        {value: 'commercial', label: 'Commercial'},
        {value: 'non_commercial', label: 'Non commercial'},
        {value: 'personal', label: 'Personal'}
    ];
    $scope.app.sourceRequest.reason = '';
    $scope.app.sourceRequest.applicationUrl = '';
    $scope.app.sourceRequest.usageType = 'invalid'; //default value for usage type
    $scope.app.wait = false;
    $scope.ok = function() {
        $scope.app.wait = true;
        SourceRequests.send(
            $scope.app.sourceRequest.source.id,
            $scope.app.sourceRequest.applicationId,
            $scope.app.sourceRequest.applicationUrl,
            $scope.app.sourceRequest.reason,
            $scope.app.sourceRequest.usageType,
            true
        )
        .then(function() {
            $modalInstance.close();
        },
        function(error) {
            $log.error(error);
            $modalInstance.close();
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
