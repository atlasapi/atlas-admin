'use strict';

angular.module('atlasAdmin.epg', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/epg/bt-tv', {
      templateUrl: 'partials/epgWidget.html',
      controller: 'CtrlEPGWidget'
    });
  }]);
