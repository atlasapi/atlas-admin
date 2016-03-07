'use strict';

angular.module('atlasAdmin.applications', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/applications/:applicationId/requestSource/:sourceId', {
      templateUrl: 'partials/requestSource.html',
      controller: 'CtrlRequestSource'
    });
  }]);
