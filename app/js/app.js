'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('atlasAdmin', ['atlasAdmin.filters', 'atlasAdmin.services', 'atlasAdmin.directives', 'atlasAdmin.controllers','ngResource','atlasAdminConfig']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/sources', {templateUrl: 'partials/sources.html', controller: 'CtrlSources'});
    $routeProvider.when('/sources/:sourceId', {templateUrl: 'partials/sourceReaders.html', controller: 'CtrlSourceReaders'});
    $routeProvider.when('/requests', {templateUrl: 'partials/requests.html', controller: 'CtrlRequests'});
    $routeProvider.when('/applications', {templateUrl: 'partials/applications.html', controller: 'CtrlApplications'});
    $routeProvider.otherwise({redirectTo: '/sources'});
  }]);

app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
      console.log($httpProvider);
    }
  ]);


