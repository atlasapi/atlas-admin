'use strict';

angular.module('atlasAdmin.terms', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/terms', {
      templateUrl: 'presentation/terms/terms.tpl.html',
      controller: 'UserLicenseController'
    });
  }]);
