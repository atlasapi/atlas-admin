'use strict';

angular.module('atlasAdmin.controllers.applications')
.controller('CreateApplicationFormModalCtrl', ['$scope', '$modalInstance', 'Applications', '$location', 
    function($scope, $modalInstance, Applications, $location) {

    $scope.app.terms = false;
    $scope.app.title = '';
    $scope.app.url = '';
    $scope.app.description = '';
    $scope.app.preset = null;

    // decide whether terms should be shown for this source set
    $scope.showTerms = function(preset) {
        $scope.app.terms = 'uk' === preset;
    }

    $scope.submit = function() {
        var app_title       = $scope.app.title,
            app_description = $scope.app.description,
            app_preset      = $scope.app.preset;

        // save the app data
        Applications.create(app_title, app_description)
            .then(function(result) {
                if (result.data.application.id) {
                    var appId = result.data.application.id;
                    // enable matching on simple account
                    if (app_preset === 'uk') {
                        var sourceOrder = [];
                        for (var source in result.data.application.sources.reads) {
                            sourceOrder.push(result.data.application.sources.reads[source].id);
                        }
                        Applications.setPrecedence(appId, sourceOrder);
                    }else{
                        $location.path('/applications/'+appId);
                    }
                    // close modal and return data
                    result.data.application.source = $scope.app.sources;
                    $modalInstance.close(result.data.application);
                }
            });
    };

    // cancel and close modal
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);