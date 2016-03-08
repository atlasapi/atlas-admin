'use strict';

angular.module('atlasAdmin.contact', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/contact', {
      templateUrl: 'presentation/contact/contact.tpl.html',
      controller: 'ContactController'
    });
  }]);
