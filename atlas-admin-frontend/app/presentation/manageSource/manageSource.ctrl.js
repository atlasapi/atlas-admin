'use strict';

angular.module('atlasAdmin.manageSource')
  .controller('CtrlManageSource', function($scope, $rootScope, $routeParams, Sources, Applications) {
    $scope.currentTab = 'readers';
  });
