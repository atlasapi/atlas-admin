'use strict';

angular.module('atlasAdmin.feed', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/feeds/:feedId', {
      templateUrl: 'presentation/feed/feed.tpl.html',
      controller: 'CtrlFeedsConsole'
    });
  }]);