'use strict';

angular.module('atlasAdmin.feedBreakdown', ['ngRoute', 'atlasAdmin.loadContent', 'atlasAdmin.actionModal'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/feeds/:feedId/:taskId', {
      templateUrl: 'presentation/feedBreakdown/feedBreakdown.tpl.html',
      controller: 'CtrlFeedsBreakdown'
    });
  }]);
