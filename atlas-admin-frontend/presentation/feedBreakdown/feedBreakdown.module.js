'use strict';

angular.module('atlasAdmin.feedBreakdown', [
    'ngRoute',
    'atlasAdmin.directives.loadContent',
    'atlasAdmin.directives.actionModal',
    'atlasAdmin.services.feeds'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/feeds/:feedId/:taskId', {
      templateUrl: 'presentation/feedBreakdown/feedBreakdown.tpl.html',
      controller: 'CtrlFeedsBreakdown'
    });
  }]);
