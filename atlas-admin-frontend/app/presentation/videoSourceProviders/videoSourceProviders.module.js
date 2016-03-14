'use strict';

angular.module('atlasAdmin.videoSourceProviders', [
    'ngRoute',
    'atlasAdmin.services.uservideosources'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/videosource/providers', {
      templateUrl: 'app/presentation/videoSourceProviders/videoSourceProviders.tpl.html',
      controller: 'CtrlVideoSourceProviders'
    });
  }]);
