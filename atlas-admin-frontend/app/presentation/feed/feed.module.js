'use strict';

angular.module('atlasAdmin.feed', [
    'ngRoute',
    'atlasAdmin.directives.actionModal',
    'atlasAdmin.services.feeds'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/feeds/:feedId', {
      templateUrl: 'presentation/feed/feed.tpl.html',
      controller: 'CtrlFeedsConsole'
    });
  }]);
