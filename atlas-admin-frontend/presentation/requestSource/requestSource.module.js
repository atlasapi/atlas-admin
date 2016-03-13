'use strict';

angular.module('atlasAdmin.requestSource', [
    'ngRoute',
    'atlasAdmin.services.applications',
    'atlasAdmin.services.payments',
    'atlasAdmin.services.sourceRequests'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/applications/:applicationId/requestSource/:sourceId', {
      templateUrl: 'presentation/requestSource/requestSource.tpl.html',
      controller: 'CtrlRequestSource'
    });
  }]);
