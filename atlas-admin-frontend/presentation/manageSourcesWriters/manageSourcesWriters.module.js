'use strict';

angular.module('atlasAdmin.manageSourcesWriters', ['ngRoute', 'atlasAdmin.directives.focus'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/manage/sources/:sourceId/writers', {
      templateUrl: 'presentation/manageSourcesWriters/manageSourcesWriters.tpl.html',
      controller: 'CtrlSourceWriters'
    });
  }]);
