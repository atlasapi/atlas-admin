'use strict';

angular.module('atlasAdmin.controllers.applications')
.controller('CreateApplicationFormModalCtrl', ['$scope', '$modalInstance', 'Applications', 'sourceRequests', '$location', 
    function($scope, $modalInstance, Applications, SourceRequests, $location) {
    $scope.app.showTerms = false;
    $scope.app.acceptTerms = false;
    $scope.app.title = '';
    $scope.app.url = '';
    $scope.app.description = '';
    $scope.app.preset = null;

    // decide whether terms should be shown for this source set
    $scope.termsToggle = function(preset) {
        $scope.app.showTerms = ($scope.app.preset == 'uk')
    }

    $scope.submit = function() {
        var app_title       = $scope.app.title,
            app_description = $scope.app.description,
            app_preset      = $scope.app.preset,
            app_terms       = $scope.app.acceptTerms;

        // save the app data
        if (_.isString(app_title) && _.isString(app_description) && _.isString(app_preset)) {
            if (app_preset === 'uk' && !app_terms) return;
            Applications.create(app_title, app_description).then(function(result) {
                if (result.data.application.id) {
                    var appId = result.data.application.id;
                    // enable basic sources matching on simple account
                    if (app_preset === 'uk') {
                        var _item, sourceOrder = [], enableSources = [];
                        for (var source in result.data.application.sources.reads) {
                            _item = result.data.application.sources.reads[source];
                            if (_item.title === 'BBC' || _item.title === 'PA') {
                                enableSources.push(_item);
                            }
                            sourceOrder.push(_item.id);
                        }
                        // send source requests for default sources
                        _(enableSources).forEach(function(src) {
                            SourceRequests.send(src.id, appId, '', '', 'personal', true);
                        })
                        Applications.setPrecedence(appId, sourceOrder);
                    }else{
                        $location.path('/applications/'+appId);
                    }
                    // close modal and return data tot he $scope
                    result.data.application.source = $scope.app.sources;
                    $modalInstance.close(result.data.application);
                }
            });
        }
    };

    // cancel and close modal
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);