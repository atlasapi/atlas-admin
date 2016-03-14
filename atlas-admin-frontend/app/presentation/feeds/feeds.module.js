'use strict';

angular.module('atlasAdmin.feeds', [
    'ngRoute',
    'atlasAdmin.services.feeds'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/feeds', {
      templateUrl: 'presentation/feeds/feeds.tpl.html',
      controller: 'CtrlFeeds'
    });
  }]);
