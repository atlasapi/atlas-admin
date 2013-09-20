'use strict';


// Declare app level module which depends on filters, and services
angular.module('atlasAdmin', ['atlasAdmin.filters', 'atlasAdmin.services', 'atlasAdmin.directives', 'atlasAdmin.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/sources', {templateUrl: 'partials/sources.html', controller: 'CtrlSources'});
    $routeProvider.when('/requests', {templateUrl: 'partials/requests.html', controller: 'CtrlRequests'});
    $routeProvider.when('/applications', {templateUrl: 'partials/applications.html', controller: 'CtrlApplications'});
    $routeProvider.otherwise({redirectTo: '/sources'});
  }]);
