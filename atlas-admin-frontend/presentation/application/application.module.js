'use strict';

angular.module('atlasAdmin.application', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/applications/:applicationId', {
      templateUrl: 'partials/applicationEdit.html',
      controller: 'CtrlApplicationEdit',
      reloadOnSearch: false
    });
  }]);
