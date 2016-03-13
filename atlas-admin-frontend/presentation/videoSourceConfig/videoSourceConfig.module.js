'use strict';

angular.module('atlasAdmin.videoSourceConfig', [
    'ngRoute',
    'atlasAdmin.services.uservideosources'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/videosource/config/youtube', {
      templateUrl: 'presentation/videoSourceConfig/videoSourceConfig.tpl.html',
      controller: 'CtrlVideoSourceYouTubeConfig'
    });
  }]);
