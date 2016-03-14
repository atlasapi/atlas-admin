'use strict';
angular.module('atlasAdmin.manageSources')
  .controller('CtrlSources', function($scope, $rootScope, $routeParams, Sources) {
      $rootScope.view_title = "Manage sources";
      $scope.app = {};
      Sources.all().then(function(sources) {
          $scope.app.sources = sources;
          $scope.app.predicate='name';
          $scope.app.reverse=false;
          $scope.app.pageSize=10;
          $scope.app.currentPage = 1;
      });
  });
