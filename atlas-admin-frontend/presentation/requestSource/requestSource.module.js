'use strict';

angular.module('atlasAdmin.requestSource', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/applications/:applicationId/requestSource/:sourceId', {
      templateUrl: 'presentation/requestSource/requestSource.tpl.html',
      controller: 'CtrlRequestSource'
    });
  }]);
