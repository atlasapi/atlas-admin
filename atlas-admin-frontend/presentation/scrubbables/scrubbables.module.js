'use strict';

angular.module('atlasAdmin.scrubbables', ['ngRoute', 'atlasAdmin.scrubber', 'atlasAdmin.atlasSearch'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/scrubbables', {
      templateUrl: 'presentation/scrubbables/create.tpl.html',
      controller: 'CtrlBBCScrubbables'
    });
    $routeProvider.when('/scrubbables/:atlasId', {
      templateUrl: 'presentation/scrubbables/create.tpl.html',
      controller: 'CtrlBBCScrubbables'
    });
  }]);
