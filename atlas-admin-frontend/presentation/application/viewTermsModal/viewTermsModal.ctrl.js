'use strict';

angular.module('atlasAdmin.application')
.controller('CtrlApplicationEdit', ['$scope', '$rootScope', '$routeParams', 'Applications', 'Sources', 'SourceLicenses', 'Authentication', 'atlasApiHost', '$modal', '$sce', '$log', '$http', '$q', 'APIUsage', 'Atlas', '$location',
    function($scope, $rootScope, $routeParams, Applications, Sources, SourceLicenses, Authentication, atlasApiHost, $modal, $sce, $log, $http, $q, Usage, Atlas, $location) {
      $scope.close = function() {
          $modalInstance.dismiss();
      };
    }]);
