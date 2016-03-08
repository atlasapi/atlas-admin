'use strict';

angular.module('atlasAdmin.manageSourcesReaders', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/manage/sources/:sourceId/readers', {
      templateUrl: 'presentation/manageSourcesReaders/manageSourcesReaders.tpl.html',
      controller: 'CtrlSourceReaders'
    });
  }]);
