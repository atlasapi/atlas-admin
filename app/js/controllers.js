'use strict';

/* Controllers */

angular.module('atlasAdmin.controllers', []).
  controller('CtrlSources', function($scope, $rootScope, $routeParams) {
      $rootScope.title = "Sources";
  })
  .controller('CtrlRequests', function($scope, $rootScope, $routeParams) {
     $rootScope.title = "Requests";
  })
  .controller('CtrlApplications', function($scope, $rootScope, $routeParams) {
     $rootScope.title = "Applications";
  });


var aaContainer = function($scope) {
     //$scope.title = "test";
}  



var sourcesPage = function($scope, $routeParams, $http, atlasHost) {
  // $scope.sources = AllSources.query();
    $http.jsonp(atlasHost + '/sources.json?callback=JSON_CALLBACK').success(function(data) {
        $scope.sources = data.sources;
    });
};