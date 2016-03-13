'use strict';

angular.module('atlasAdmin.epg', [
    'ngRoute',
    'atlasAdmin.services.users'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/epg/bt-tv', {
      templateUrl: 'presentation/epg/epg.tpl.html',
      controller: 'CtrlEPGWidget'
    });
  }]);
