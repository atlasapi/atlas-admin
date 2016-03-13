'use strict';

angular.module('atlasAdmin.contact', [
    'ngRoute',
    'atlasAdmin.services.users'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/contact', {
      templateUrl: 'presentation/contact/contact.tpl.html',
      controller: 'ContactController'
    });
  }]);
