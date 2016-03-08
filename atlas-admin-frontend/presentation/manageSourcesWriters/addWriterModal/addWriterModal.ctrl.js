angular.module('atlasAdmin.manageSourcesWriters')
  .controller('AddWriterTypeaheadCtrl', function($scope, $modalInstance, Applications) {
    $scope.item = {};
    $scope.item.invalid = true;
    $scope.item.selected = undefined;
    $scope.app = {};
    $scope.app.wait = true;
    Applications.all().then(function(applications) {
        $scope.app.wait = false;
        $scope.applications = applications;
    });

    $scope.ok = function () {
        $scope.app.wait = true;
        $modalInstance.close($scope.item.selected);
    };

    $scope.cancel = function () {
        $scope.app.wait = true;
        $modalInstance.dismiss('cancel');
    };

    $scope.onSelect = function ($item, $model, $label) {
        $scope.item.invalid = false;
    }

    $scope.selectionChanged = function() {
        $scope.item.invalid = true;
    }
  });
