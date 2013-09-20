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


var sourcesPage = function($scope, $routeParams) {
   // $scope.title = "test 2";
    
   
};